const router = require("express").Router();
const NotificationController = require("./controller");
const validate = require("../../../utils/validator");
const notificationValidator = require("./validation")
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(authorize, NotificationController.getAllNotifications);
router.route("/userNotifications").get(authorize, NotificationController.getAllUserNotifications);
router.route("/systemNotifications").get(authorize, NotificationController.getAllSystemNotifications);
router.route("/:id").get(authorize, uuidValidator, NotificationController.getOneNotification);

router
  .route("/")
  .post(authorize, NotificationController.createNotification);

router
  .route("/deleteAllNotifications")
  .delete(authorize, NotificationController.deleteAllNotifications);

router
  .route("/:id")
  .delete(authorize, uuidValidator, NotificationController.deleteNotification);

router
  .route("/:id")
  .patch(authorize, uuidValidator, NotificationController.updateNotificationById);


module.exports = router;