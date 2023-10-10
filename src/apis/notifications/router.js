// const router = require("express").Router();
// const NotificationController = require("./controller");
// const validate = require("../../../utils/validator");
// const notificationValidator = require("./validation")
// const { uuidValidator } = require("../../../utils/uuid");
// const authorize = require("../../middlewares/auth/authorization");
// const permissionMiddleware = require("../../middlewares/permission.middleware");

// router.route("/").get(authorize, permissionMiddleware(['view-notifications']), NotificationController.getAllNotifications);
// router.route("/userNotifications").get(authorize, permissionMiddleware(['view-user-notifications']), NotificationController.getAllUserNotifications);
// router.route("/systemNotifications").get(authorize, permissionMiddleware(['view-system-notifications']), NotificationController.getAllSystemNotifications);
// router.route("/:id").get(authorize, permissionMiddleware(['view-notification']), uuidValidator, NotificationController.getOneNotification);

// router
//   .route("/")
//   .post(authorize, permissionMiddleware(['create-notification']), NotificationController.createNotification);

// router
//   .route("/deleteAllNotifications")
//   .delete(authorize, permissionMiddleware(['delete-notifications']), NotificationController.deleteAllNotifications);

// router
//   .route("/:id")
//   .delete(authorize, permissionMiddleware(['delete-notifications']), uuidValidator, NotificationController.deleteNotification);


// module.exports = router;