const models = require("../models");
const ResponseAPI = require("../utils/response");

const notificationController = {

    getNotificationByRole: async (req, res, next) => {
        try {
            const role = req.user.role;

            let filter = {}

            if (role === 'MANAGER') {
                filter = { role_type: 'MANAGER' }
            } else {
                filter = { role_type: 'OFFICER', user_id: req.user._id }
            }
            const notifications = await models.notifications.find(filter).sort({ is_read: 1, createdAt: -1 });
            const unreadCount = await models.notifications.countDocuments({
                ...filter,
                is_read: false 
            });

            ResponseAPI.success(res, {
                unreadCount,
                notifications,
            });
        } catch (error) {
            next(error);
        }
    },

    readNotification: async (req, res, next) => {
        try {
            const notificationId = req.params.id;
            const notification = await models.notifications.findById(notificationId);
            if (!notification) {
                return ResponseAPI.error(res, 'Notification not found', 404);
            }
            notification.is_read = true;
            await notification.save();
            ResponseAPI.success(res, notification);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = notificationController