const PermissionController = require("./controller");
const router = require("express").Router();
const validator = require("../../../utils/validator");
const createPermissionValidator = require("../permissions/validation");
const uuidValidator = require("../../../utils/uuidValidator");

const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(PermissionController.getAllPermissions);
router.route("/:id").get(authorize, permissionMiddleware(['view-permission']), uuidValidator, PermissionController.getPermissionById);
router.route("/").post(validator(createPermissionValidator), PermissionController.createPermission);
router.route('/:id').patch(authorize, permissionMiddleware(['update-permission']), uuidValidator, validator(createPermissionValidator), PermissionController.updatePermission);
router.route("/:id").delete(authorize, permissionMiddleware(['delete-permission']), PermissionController.deletePermission);
router.route("/user/:userId/permission/:permissionId").delete(authorize, permissionMiddleware(['delete-assigned-permission']), PermissionController.deleteSpecificUserPermission);

module.exports = router;
