const RolePermissionController = require('./controller');
const validator = require('../../../utils/validator');
const createrolePermissionValidator = require('./validation');

const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require('../../middlewares/permission.middleware');
// const permissionMiddleware = require("../../middlewares/permission.middleware");

const router = require('express').Router();
router.route("/").get(authorize, permissionMiddleware(["view-role-permission"]), RolePermissionController.getAllRolePermission);
router.route("/:id").get(RolePermissionController.getRolePermissionById);
router.route("/:id").post(authorize, permissionMiddleware(["assign-permission-to-role"]), RolePermissionController.assignPermissionToRole);


module.exports = router;