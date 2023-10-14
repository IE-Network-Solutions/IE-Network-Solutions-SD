const RolePermissionController = require('./controller');
const validator = require('../../../utils/validator');
const createrolePermissionValidator = require('./validation');

const authorize = require("../../middlewares/auth/authorization");
// const permissionMiddleware = require("../../middlewares/permission.middleware");

const router = require('express').Router();
router.route("/").get(RolePermissionController.getAllRolePermission);
router.route("/:id").get(RolePermissionController.getRolePermissionById);
router.route("/:id").post(RolePermissionController.assignPermissionToRole);


module.exports = router;