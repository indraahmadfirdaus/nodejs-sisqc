const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  incident_date: {
    type: Date,
    required: true
  },
  reporter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photo_url: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;
