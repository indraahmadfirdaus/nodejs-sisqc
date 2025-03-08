const models = require('../models');
const ResponseAPI = require('../utils/response');
const { imageUpload, imageUploadBase64 } = require('../utils/imageUtil');
const fs = require('fs');


const qcReportController = {
  async createReport(req, res, next) {
    try {
      const { title, report_notes, description, items, photos, report_date } = req.body;
      
      // Process QC report items
      const qcReportItems = [];
      let totalApprovedCount = 0;
      let totalRejectedCount = 0;
  
      items.forEach((item, index) => {
        const approvedCount = parseInt(item.approved_count) || 0;
        const rejectedCount = parseInt(item.rejected_count) || 0;
  
        totalApprovedCount += approvedCount;
        totalRejectedCount += rejectedCount;
  
        qcReportItems.push({
          goods_id: item.goods_id,
          approved_count: approvedCount,
          rejected_count: rejectedCount,
          index: index + 1
        });
      });
  
      // Process base64 photos
      const photoUrls = [];
      
      if (photos && photos.length > 0) {
        for (const base64Image of photos) {
          const uploadedUrl = await imageUploadBase64(base64Image);
          photoUrls.push(uploadedUrl);
        }
      }
  
      // Create QC Report
      const qcReport = await models.qcReport.create({
        title,
        description,
        report_notes,
        reporter_id: req.user._id,
        qcReportItems,
        approved_count: totalApprovedCount,
        rejected_count: totalRejectedCount,
        photo_urls: photoUrls,
        report_date: report_date || new Date()
      });
  
      ResponseAPI.success(res, qcReport, 201);
  
    } catch (error) {
      next(error);
    }
  },

  async getAllReports(req, res, next) {
    try {
      const reports = await models.qcReport.find()
        .populate('qcReportItems.goods_id')
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
      const { title, report_notes, description, items, photos, report_date } = req.body;
      const report = await models.qcReport.findById(req.params.id);
  
      if (!report) {
        return ResponseAPI.error(res, 'QC Report not found', 404);
      }
  
      // Process QC report items
      const qcReportItems = [];
      let totalApprovedCount = 0;
      let totalRejectedCount = 0;
  
      if (items && items.length > 0) {
        items.forEach((item, index) => {
          const approvedCount = parseInt(item.approved_count) || 0;
          const rejectedCount = parseInt(item.rejected_count) || 0;
    
          totalApprovedCount += approvedCount;
          totalRejectedCount += rejectedCount;
    
          qcReportItems.push({
            goods_id: item.goods_id,
            approved_count: approvedCount,
            rejected_count: rejectedCount,
            index: index + 1
          });
        });
      }
  
      // Process photos based on different scenarios
      let photoUrls = [];
      if (photos === null || photos === undefined) {
        // If no photos sent, keep existing photos
        photoUrls = report.photo_urls;
      } else if (photos.length === 0) {
        // If empty array sent, delete all photos
        photoUrls = [];
      } else {
        // Process new photos
        for (const photo of photos) {
          // Check if string is base64
          const isBase64 = /^data:image\/[a-z]+;base64,/.test(photo);
          
          if (isBase64) {
            // Upload base64 image
            const uploadedUrl = await imageUploadBase64(photo);
            photoUrls.push(uploadedUrl);
          } else {
            // If it's a URL, add it directly
            photoUrls.push(photo);
          }
        }
      }

      // Update report
      report.title = title || report.title;
      report.description = description || report.description;
      report.report_notes = report_notes || report.report_notes;
      report.qcReportItems = qcReportItems.length > 0 ? qcReportItems : report.qcReportItems;
      report.approval_status = 'SUBMITTED';
      report.approved_count = totalApprovedCount || report.approved_count;
      report.rejected_count = totalRejectedCount || report.rejected_count;
      report.photo_urls = photoUrls;
      report.report_date = report_date || report.report_date;
      report.updated_at = new Date();
  
      await report.save();
      ResponseAPI.success(res, report);
  
    } catch (error) {
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

      await report.deleteOne();

      ResponseAPI.success(res, null, 200, 'QC Report deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = qcReportController;