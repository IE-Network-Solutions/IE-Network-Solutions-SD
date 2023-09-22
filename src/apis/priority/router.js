const router = require("express").Router();
const PriorityController = require("./controller");
const validate = require("../../../utils/validator");
const { priorityValidator } = require("./validation");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(authorize, permissionMiddleware(['view-priorities']), PriorityController.getAllPriorities);
router
  .route("/:id")
  .get(authorize, permissionMiddleware(['view-priority']), uuidValidator, PriorityController.getPriority);

router
  .route("/")
  .post(
    authorize, permissionMiddleware(['create-priority']),
    validate(priorityValidator),
    PriorityController.createPriority
  );

router.route("/").patch(authorize, permissionMiddleware(['update-priority']), PriorityController.editPriority);

router
  .route("/deleteAllPriorities")
  .delete(authorize, permissionMiddleware(['delete-priorities']), PriorityController.deleteAllPriorities);

router
  .route("/:id")
  .delete(authorize, permissionMiddleware(['delete-priority']), uuidValidator, PriorityController.deletePriority);

module.exports = router;
