const User = require('./User.js');
const QCReport = require('./QCReports.js');
const Goods = require('./Goods.js');
const mongoose = require('mongoose');
const Notification = require('./Notifications.js');


const models = {
  user: User,
  qcReport: QCReport,
  goods: Goods,
  notifications: Notification,
  base: mongoose
};

module.exports = models;
