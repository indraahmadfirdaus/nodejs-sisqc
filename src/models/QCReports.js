const mongoose = require('mongoose');

const qcReportItemSchema = new mongoose.Schema({
  goods_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goods',
    required: true
  },
  approved_count: {
    type: Number,
    required: true,
    default: 0
  },
  rejected_count: {
    type: Number,
    required: true,
    default: 0
  },
  photo_url: {
    type: String,
  }
});

const QCReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  report_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  reporter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved_count: {
    type: Number,
    required: true,
    default: 0
  },
  rejected_count: {
    type: Number,
    required: true,
    default: 0
  },
  report_notes: {
    type: String
  },
  approval_status: {
    type: String,
    enum: ['SUBMITTED', 'APPROVED', 'REJECTED'],
    default: 'SUBMITTED'
  },
  approval_notes: {
    type: String
  },
  approval_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  incident_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
  },
  qcReportItems: [qcReportItemSchema]
});

const QCReport = mongoose.model('QCReport', QCReportSchema);

module.exports = QCReport;
