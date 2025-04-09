const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  is_read: {
    type: Boolean,
    default: false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  role_type: {
    type: String,
    enum: ['MANAGER', 'OFFICER'],
    required: true
  },
  qc_report_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QCReport',
  },
  notification_type: {
    type: String
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
