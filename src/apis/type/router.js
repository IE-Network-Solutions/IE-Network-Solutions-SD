const router = require("express").Router();
const TypeController = require("./controller");
const typeValidator = require("./validation");
const validate = require("../../../utils/validator");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

const permissionMiddleware = require("../../middlewares/permission.middleware");


router.route("/").get(TypeController.getAllTypes);
router.route("/:id").get(uuidValidator, TypeController.getOneType);

router.route("/").post(authorize, permissionMiddleware(['create-type']), TypeController.createType);

router.route("/").patch(authorize, permissionMiddleware(['edit-type']), TypeController.editType);

router.route("/deleteAllTypes").delete(authorize, permissionMiddleware(['delete-types']), TypeController.deleteAllTypes);

router.route("/:id").delete(authorize, permissionMiddleware(['delete-type']), uuidValidator, TypeController.deleteType);

module.exports = router;
