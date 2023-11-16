const AppError = require("../../../utils/apperror");
const UserDAL = require("../users/dal");
const NotificationDAL = require("./dal");
const log = require("../../../utils/systemLog");

exports.introduction = async (req, res, next) => {
    // Respond
    res.status(200).json({
        status: "Success",
        data: {},
    });
};


exports.getAllNotifications = async (req, res, next) => {
    try {
        const currentLoggedInUser = req.user;
        // Get All Notifications
        const allNotifications = await NotificationDAL.getAllNotifications();
        if (!allNotifications) {
            return next(new AppError("Notification Not Found", 404))
        }

        const notificationForCurrentLoggedInUser = allNotifications.filter(notification => notification?.to === currentLoggedInUser.id);
        res.status(200).json({
            status: "Success",
            data: notificationForCurrentLoggedInUser,
        });
    } catch (error) {
        throw error;
    }
}

exports.getAllUserNotifications = async (req, res, next) => {
    try {
        // Get All User Notifications
        let notifications = await NotificationDAL.getAllUserNotifications();

        // Respond
        res.status(200).json({
            status: "Success",
            data: notifications,
        });
    } catch (error) {
        throw error;
    }
}

exports.getAllSystemNotifications = async (req, res, next) => {
    console.log("SYSTEM");
    try {
        // Get All System Notifications
        let notifications = await NotificationDAL.getAllSystemNotifications();

        // Respond
        res.status(200).json({
            status: "Success",
            data: notifications,
        });
    } catch (error) {
        throw error;
    }
}

exports.getOneNotification = async (req, res, next) => {
    // Get ID
    let id = req.params.id;
    let notification = await NotificationDAL.getOneNotification(id);

    // Return If Notification Doesn't Exist
    if (!notification) return next(new AppError("Notification does not exist", 404));

    // Respond
    res.status(200).json({
        status: "Success",
        data: notification,
    });

}

exports.createNotification = async (req, res, next) => {
    try {
        // Get Req Body
        let notification = req.body;
        let userId = req.body.user_id;
        let isUser = userId ? true : false;

        if (isUser) {
            // Get User 
            const user = await UserDAL.getOneUser(userId);
            if (!user) {
                return next(new AppError("User Does Not Exist", 404));
            }
            notification.from = `${user.first_name + " " + user.last_name}`;
            notification.created_by = user;
        }
        // Create Notification
        const newNotification = await NotificationDAL.createNotification(notification);

        // Respond
        res.status(200).json({
            status: "Success",
            data: newNotification,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteNotification = async (req, res, next) => {
    try {
        // Get Req Body
        const id = req.params.id;
        // Check If Notification Exists
        const notification = await NotificationDAL.getOneNotification(id);
        if (!notification) {
            return next(new AppError("Notification Does Not Exist!", 404));
        }
        await NotificationDAL.deleteNotification(id);
        // Respond
        res.status(200).json({
            status: "Success",
            message: "Notification Deleted Successfully!"
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteAllNotifications = async (req, res, next) => {
    try {
        const allNotification = await NotificationDAL.getAllNotifications();
        if (!allNotification) {
            return next(new AppError("Unable to delete notification"))
        }
        allNotification.map(async (notification) => {
            await NotificationDAL.deleteAllNotifications(notification.id);
        })


        // Respond
        res.status(200).json({
            status: "Success",
            message: "Notifications are Deleted Successfully!"
        });
    } catch (error) {
        throw error;
    }
}

exports.updateNotificationById = async (req, res, next) => {
    const result = await NotificationDAL.getOneNotification(req.params.id);
    if (!result) {
        return next(new AppError("Notification id is Not Found"));
    }

    const update = await NotificationDAL.updateNotificationById(req.params.id, req.body);
    if (!update) {
        return next(new AppError("Unable to update", 400))
    }
    res.status(200).json({
        status: "Success",
        data: await NotificationDAL.getOneNotification(req.params.id)
    })

    // const update = await
}


