const models = require('../models');
const ResponseAPI = require('../utils/response');
const { imageUpload } = require('../utils/imageUtil');
const fs = require('fs');

const incidentController = {
  async createIncident(req, res, next) {
    try {
      const { title, description, incident_date } = req.body;
      
      let photo_url = null;
      if (req.file) {
        photo_url = await imageUpload(req.file);
      }

      const incident = await models.incident.create({
        title,
        description,
        incident_date,
        photo_url,
        reporter_id: req.user._id
      });

      ResponseAPI.success(res, incident, 201);
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  async getAllIncidents(req, res, next) {
    try {
      const incidents = await models.incident
        .find()
        .populate('reporter_id', 'name email')
        .populate('qc_report_id');

      ResponseAPI.success(res, incidents);
    } catch (error) {
      next(error);
    }
  },

  async getIncidentById(req, res, next) {
    try {
      const incident = await models.incident
        .findById(req.params.id)
        .populate('reporter_id', 'name email')
        .populate('qc_report_id');

      if (!incident) {
        return ResponseAPI.error(res, 'Incident not found', 404);
      }

      ResponseAPI.success(res, incident);
    } catch (error) {
      next(error);
    }
  },

  async updateIncident(req, res, next) {
    try {
      const { title, description, incident_date } = req.body;
      const incident = await models.incident.findById(req.params.id);

      if (!incident) {
        return ResponseAPI.error(res, 'Incident not found', 404);
      }

      // Check if user is authorized to update (reporter or admin)
      if (incident.reporter_id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
        return ResponseAPI.error(res, 'Not authorized to update this incident', 403);
      }

      if (req.file) {
        const photo_url = await imageUpload(req.file);
        incident.photo_url = photo_url;
      }

      incident.title = title || incident.title;
      incident.description = description || incident.description;
      incident.incident_date = incident_date || incident.incident_date;

      await incident.save();

      ResponseAPI.success(res, incident);
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      next(error);
    }
  },

  async deleteIncident(req, res, next) {
    try {
      const incident = await models.incident.findById(req.params.id);

      if (!incident) {
        return ResponseAPI.error(res, 'Incident not found', 404);
      }

      // Check if user is authorized to delete (reporter or admin)
      if (incident.reporter_id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
        return ResponseAPI.error(res, 'Not authorized to delete this incident', 403);
      }

      await incident.deleteOne();

      ResponseAPI.success(res, null, 200, 'Incident deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = incidentController;