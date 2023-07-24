const router = require("express").Router();
const PriorityController = require("./controller");
const validate = require("../../../utils/validator");
const priorityValidator = require("./validation")
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(authorize, PriorityController.getAllPriorities);
router.route("/:id").get(authorize, uuidValidator, PriorityController.getPriority);

router
    .route("/")
    .post(authorize, validate(priorityValidator), PriorityController.createPriority);

router
    .route("/")
    .patch(authorize, PriorityController.editPriority);

router
    .route("/deleteAllPriorities")
    .delete(authorize, PriorityController.deleteAllPriorities);
    
router
  .route("/:id")
  .delete(authorize, uuidValidator, PriorityController.deletePriority);



module.exports = router;