const User = require('./User.js');
const QCReport = require('./QCReports.js');
const Goods = require('./Goods.js');
const mongoose = require('mongoose');


const models = {
  user: User,
  qcReport: QCReport,
  goods: Goods,
  base: mongoose
};

module.exports = models;
