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
  index: {
    type: Number,
    required: true
  }
});

const QCReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
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
  qcReportItems: [qcReportItemSchema],
  photo_urls: {
    type: [String],
    default: []
  },
});

const QCReport = mongoose.model('QCReport', QCReportSchema);

module.exports = QCReport;
