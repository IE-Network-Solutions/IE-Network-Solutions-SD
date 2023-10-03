const RolePermissionController = require('./controller');
const validator = require('../../../utils/validator');
const createrolePermissionValidator = require('./validation');

const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

const router = require('express').Router();
router.route("/").get(authorize, permissionMiddleware(['view-role-permissions']), RolePermissionController.getAllRolePermission);
router.route("/:id").get(authorize, permissionMiddleware(['view-role-permission']), RolePermissionController.getRolePermissionById);
router.route("/:id").post(validator(authorize, permissionMiddleware(['create-role-permissions']), createrolePermissionValidator), RolePermissionController.assignPermissionToRole);


module.exports = router;