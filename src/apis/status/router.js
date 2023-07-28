const router = require("express").Router();
const StatusController = require("./controller");
const validate = require("../../../utils/validator");
const { statusValidator } = require("./validation");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(authorize, StatusController.getAllStatuses);
router.route("/:id").get(authorize, uuidValidator, StatusController.getStatus);

router
  .route("/")
  .post(authorize, validate(statusValidator), StatusController.createStatus);

router.route("/").patch(authorize, StatusController.editStatus);

router
  .route("/deleteAllStatuses")
  .delete(authorize, StatusController.deleteAllStatuses);

router
  .route("/:id")
  .delete(authorize, uuidValidator, StatusController.deleteStatus);

module.exports = router;
