const UserPermissionController = require('./controller');
const uuidValidator = require('../../../utils/uuidValidator');
const validator = require('../../../utils/validator');
const createUserPermissionValidator = require('./validation');

const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

const router = require('express').Router();
router.route("/").get(authorize, UserPermissionController.getAllUserPermission);
router.route("/:id").get(authorize, uuidValidator, UserPermissionController.getUserPermissionById);
router.route("/:id").post(authorize, validator(createUserPermissionValidator), UserPermissionController.assignPermissionToUser);
// router.route("/:id").delete(authorize, UserPermissionController.deleteUserPermissionById);
router.route("/:id").delete(authorize, UserPermissionController.deleteUserPermissionById);
router.route("/user-role-permission/:id").post(authorize, UserPermissionController.updateUserRolePermissionByUserId);


module.exports = router;

