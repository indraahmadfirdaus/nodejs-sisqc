const models = require('../models');
const ResponseAPI = require('../utils/response');
const { imageUpload } = require('../utils/imageUtil');
const fs = require('fs');

const qcReportController = {
  async createReport(req, res, next) {
    try {
      const { title, report_notes, qcReportItems, incident } = req.body;
      
      // Handle QC report items photos
      const processedItems = await Promise.all(
        JSON.parse(qcReportItems).map(async (item) => {
          let photo_url = null;
          if (req.files && req.files.photo) {
            const photoFile = req.files.photo.find(
              (file) => file.fieldname === `photo`
            );
            if (photoFile) {
              photo_url = await imageUpload(photoFile);
            }
          }
          return {
            ...item,
            photo_url
          };
        })
      );

      // Create QC Report
      const qcReport = await models.qcReport.create({
        title,
        report_notes,
        reporter_id: req.user._id,
        qcReportItems: processedItems
      });

      // Handle incident if provided
      if (incident) {
        const parsedIncident = JSON.parse(incident);
        let incident_photo_url = null;
        
        if (req.files && req.files.incident_photo) {
          incident_photo_url = await imageUpload(req.files.incident_photo[0]);
        }

        const createdIncident = await models.incident.create({
          title: parsedIncident.title,
          description: parsedIncident.description,
          incident_date: parsedIncident.incident_date,
          photo_url: incident_photo_url,
          qc_report_id: qcReport._id,
          reporter_id: req.user._id
        });

        qcReport.incident_id = createdIncident._id;
        await qcReport.save();
      }

      ResponseAPI.success(res, qcReport, 201);
    } catch (error) {
      // Cleanup uploaded files if error occurs
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      next(error);
    }
  },

  async getAllReports(req, res, next) {
    try {
      const reports = await models.qcReport.find()
        .populate('qcReportItems.goods_id')
        .populate('incident_id')
        .populate('reporter_id', 'name email');
      
      ResponseAPI.success(res, reports);
    } catch (error) {
      next(error);
    }
  },

  async getReportById(req, res, next) {
    try {
      const report = await models.qcReport.findById(req.params.id)
        .populate('qcReportItems.goods_id')
        .populate('incident_id')
        .populate('reporter_id', 'name email');

      if (!report) {
        return ResponseAPI.error(res, 'QC Report not found', 404);
      }

      ResponseAPI.success(res, report);
    } catch (error) {
      next(error);
    }
  },

  async getReportsByReporterId(req, res, next) {
    try {
      const reports = await models.qcReport.find({ reporter_id: req.params.reporterId })
        .populate('qcReportItems.goods_id')
        .populate('incident_id')
        .populate('reporter_id', 'name email');

      if (!reports.length) {
        return ResponseAPI.error(res, 'No reports found for this reporter', 404);
      }

      ResponseAPI.success(res, reports);
    } catch (error) {
      next(error);
    }
  },

  async updateReport(req, res, next) {
    try {
      const { title, report_notes, qcReportItems } = req.body;
      const report = await models.qcReport.findById(req.params.id);

      if (!report) {
        return ResponseAPI.error(res, 'QC Report not found', 404);
      }

      // Handle QC report items photos
      if (qcReportItems) {
        const processedItems = await Promise.all(
          JSON.parse(qcReportItems).map(async (item) => {
            let photo_url = item.photo_url;
            if (req.files && req.files.length > 0) {
              const photoFile = req.files.find(
                (file) => file.fieldname === `photo`
              );
              if (photoFile) {
                photo_url = await imageUpload(photoFile);
              }
            }
            return {
              ...item,
              photo_url
            };
          })
        );
        report.qcReportItems = processedItems;
      }

      report.title = title || report.title;
      report.report_notes = report_notes || report.report_notes;

      await report.save();

      ResponseAPI.success(res, report);
    } catch (error) {
      if (req.files) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      next(error);
    }
  },

  async updateApprovalStatus(req, res, next) {
    try {
      const { approval_status, approval_notes } = req.body;
      const report = await models.qcReport.findById(req.params.id);

      if (!report) {
        return ResponseAPI.error(res, 'QC Report not found', 404);
      }

      report.approval_status = approval_status;
      report.approval_notes = approval_notes;
      report.approver_id = req.user._id;
      report.approved_at = Date.now();

      await report.save();

      ResponseAPI.success(res, report);
    } catch (error) {
      next(error);
    }
  },

  async deleteReport(req, res, next) {
    try {
      const report = await models.qcReport.findById(req.params.id);

      if (!report) {
        return ResponseAPI.error(res, 'QC Report not found', 404);
      }

      // Delete associated incident if exists
      if (report.incident_id) {
        await models.incident.findByIdAndDelete(report.incident_id);
      }

      await report.deleteOne();

      ResponseAPI.success(res, null, 200, 'QC Report deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = qcReportController;