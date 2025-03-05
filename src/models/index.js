const Incident = require('./Incident.js');
const User = require('./User.js');
const QCReport = require('./QCReports.js');
const Goods = require('./Goods.js');

const models = {
  incident: Incident,
  user: User,
  qcReport: QCReport,
  goods: Goods
};

module.exports = models;
