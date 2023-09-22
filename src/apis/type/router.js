const router = require("express").Router();
const TypeController = require("./controller");
const typeValidator = require("./validation");
const validate = require("../../../utils/validator");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

const permissionMiddleware = require("../../middlewares/permission.middleware");


router.route("/").get(authorize, permissionMiddleware(['view-ticket-types']), TypeController.getAllTypes);
router.route("/:id").get(authorize, permissionMiddleware(['view-ticket-type']), uuidValidator, TypeController.getOneType);

router.route("/").post(authorize, permissionMiddleware(['create-ticket-type']), TypeController.createType);

router.route("/").patch(authorize, permissionMiddleware(['update-ticket-type']), TypeController.editType);

router.route("/deleteAllTypes").delete(authorize, permissionMiddleware(['delete-ticket-types']), TypeController.deleteAllTypes);

router.route("/:id").delete(authorize, permissionMiddleware(['delete-ticket-type']), uuidValidator, TypeController.deleteType);

module.exports = router;
