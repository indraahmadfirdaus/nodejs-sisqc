const models = require("../models");
const ResponseAPI = require("../utils/response");

module.exports = {
  async getReportsByReporterId(req, res, next) {
    try {
      const reports = await models.qcReport.find({ reporter_id: req.params.reporterId })
        .populate("qcReportItems.goods_id")
        .populate("reporter_id", "name email");

      if (!reports.length) {
        return ResponseAPI.error(res, "No reports found for this reporter", 404);
      }

      ResponseAPI.success(res, reports);
    } catch (error) {
      next(error);
    }
  },

  async getMonthlyReportStats(req, res, next) {
    try {
      const stats = await models.qcReport.aggregate([
        {
          $match: {
            report_date: { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$report_date" },
              month: { $month: "$report_date" }
            },
            totalReports: { $sum: 1 },
            approvedCount: { $sum: { $cond: [{ $eq: ["$approval_status", "APPROVED"] }, 1, 0] } },
            rejectedCount: { $sum: { $cond: [{ $eq: ["$approval_status", "REJECTED"] }, 1, 0] } }
          }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } }
      ]);

      ResponseAPI.success(res, stats);
    } catch (error) {
      next(error);
    }
  },


  async getOfficerPerformance(req, res, next) {
    try {
      const performance = await models.qcReport.aggregate([
        {
          $group: {
            _id: "$reporter_id",
            totalReports: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "reporter"
          }
        },
        { $unwind: "$reporter" },
        {
          $project: {
            _id: 0,
            reporterName: "$reporter.name",
            totalReports: 1
          }
        }
      ]);

      ResponseAPI.success(res, performance);
    } catch (error) {
      next(error);
    }
  },

  async getTopRejectedItems(req, res, next) {
    try {
      const rejectedItems = await models.qcReport.aggregate([
        { $unwind: "$qcReportItems" },
        {
          $group: {
            _id: "$qcReportItems.goods_id",
            totalRejected: { $sum: "$qcReportItems.rejected_count" }
          }
        },
        {
          $lookup: {
            from: "goods",
            localField: "_id",
            foreignField: "_id",
            as: "goods"
          }
        },
        { $unwind: "$goods" },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            goodsName: "$goods.name",
            totalRejected: 1
          }
        }
      ]);

      ResponseAPI.success(res, rejectedItems);
    } catch (error) {
      next(error);
    }
  },

  async getTopApprovedItems(req, res, next) {
    try {
      const topApproved = await models.qcReport.aggregate([
        { $unwind: "$qcReportItems" },
        {
          $group: {
            _id: "$qcReportItems.goods_id",
            totalApproved: { $sum: "$qcReportItems.approved_count" }
          }
        },
        { $sort: { totalApproved: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "goods",
            localField: "_id",
            foreignField: "_id",
            as: "goods"
          }
        },
        { $unwind: "$goods" },
        {
          $project: {
            _id: 0,
            goodsName: "$goods.name",
            totalApproved: 1
          }
        }
      ]);

      ResponseAPI.success(res, topApproved);
    } catch (error) {
      next(error);
    }
  },


  async getApprovalRatio(req, res, next) {
    try {
      const ratio = await models.qcReport.aggregate([
        {
          $group: {
            _id: "$approval_status",
            count: { $sum: 1 }
          }
        }
      ]);

      ResponseAPI.success(res, ratio);
    } catch (error) {
      next(error);
    }
  }
};