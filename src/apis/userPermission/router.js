const UserPermissionController = require('./controller');
const uuidValidator = require('../../../utils/uuidValidator');
const validator = require('../../../utils/validator');
const createUserPermissionValidator = require('./validation');

const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

const router = require('express').Router();
router.route("/").get( UserPermissionController.getAllUserPermission);
// router.route("/:id").get(authorize, permissionMiddleware(['view-user-permission']), uuidValidator, UserPermissionController.getUserPermissionById);
router.route("/:id").post(UserPermissionController.assignPermissionToUser);
router.route("/:id").delete(authorize, permissionMiddleware(['delete-user-permission']), UserPermissionController.deleteUserPermissionById);
router.route("/:userId/:id").delete(authorize, permissionMiddleware(['delete-user-permission-by-user-id']), UserPermissionController.deleteSpecificUserPermissionById);
router.route("/:id").patch(authorize, permissionMiddleware(['update-user-permission']), UserPermissionController.updateUserPermissionById);


module.exports = router;