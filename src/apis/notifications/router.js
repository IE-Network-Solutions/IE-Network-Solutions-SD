const router = require("express").Router();
const NotificationController = require("./controller");
const validate = require("../../../utils/validator");
const notificationValidator = require("./validation")
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(NotificationController.getAllNotifications);
router.route("/userNotifications").get(NotificationController.getAllUserNotifications);
router.route("/systemNotifications").get(NotificationController.getAllSystemNotifications);
router.route("/:id").get(uuidValidator, NotificationController.getOneNotification);

router
  .route("/")
  .post(NotificationController.createNotification);

router
  .route("/deleteAllNotifications")
  .delete(NotificationController.deleteAllNotifications);

router
  .route("/:id")
  .delete(uuidValidator, NotificationController.deleteNotification);


module.exports = router;