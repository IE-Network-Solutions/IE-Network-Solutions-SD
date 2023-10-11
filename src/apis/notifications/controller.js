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
        // Get All Notifications
        let notifications = await NotificationDAL.getAllNotifications();

        // Log
        await log("Got All Notifications", req, res);

        // Respond
        res.status(200).json({
            status: "Success",
            data: notifications,
        });
    } catch (error) {
        throw error;
    }
}

exports.getAllUserNotifications = async (req, res, next) => {
    console.log("USER");
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
        let userID = req.body.userID;
        let isFromSystem = !userID ? true : false;

        if (isFromSystem == false) {
            // Get User 
            const user_ID = userID;
            const user = await UserDAL.getOneUser(user_ID);
            if (!user) return next(new AppError("User Does Not Exist", 404));
            notification.from = `${user.first_name + " " + user.last_name}`;
            notification.created_by = user;
        }

        // Create Notification
        let newNotification = await NotificationDAL.createNotification(notification, isFromSystem, userID);

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
        if (!notification) return next(new AppError("Notification Does Not Exist!"));

        // Delete Notification
        const deletedNotification = await NotificationDAL.deleteNotification(id);

        // Respond
        res.status(200).json({
            status: "Success",
            data: null,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteAllNotifications = async (req, res, next) => {
    try {
        // Delete All Notification
        let deletedNotifications = await NotificationDAL.deleteAllNotifications();

        // Respond
        res.status(200).json({
            status: "Success",
            data: deletedNotifications,
        });
    } catch (error) {
        throw error;
    }
}


