const router = require("express").Router();
const StatusController = require("./controller");
const validate = require("../../../utils/validator");
const { statusValidator } = require("./validation");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");


router.route("/").get(authorize, StatusController.getAllStatuses);
router.route("/:id").get(authorize, uuidValidator, StatusController.getStatus);

router
  .route("/")
  .post(authorize, permissionMiddleware(['create-status']), validate(statusValidator), StatusController.createStatus);

router.route("/").patch(authorize, permissionMiddleware(['edit-status']), StatusController.editStatus);

router
  .route("/deleteAllStatuses")
  .delete(authorize, permissionMiddleware(['delete-ticket-statuses']), StatusController.deleteAllStatuses);

router
  .route("/:id")
  .delete(authorize, permissionMiddleware(['delete-status']), uuidValidator, StatusController.deleteStatus);

module.exports = router;
