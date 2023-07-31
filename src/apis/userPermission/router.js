const UserPermissionController = require('./controller');
const uuidValidator = require('../../../utils/uuidValidator');
const validator = require('../../../utils/validator');
const createUserPermissionValidator = require('./validation');
const router = require('express').Router();
router.route("/").get(UserPermissionController.getAllUserPermission);
router.route("/:id").get(uuidValidator, UserPermissionController.getUserPermissionById);
router.route("/:id").post(validator(createUserPermissionValidator), UserPermissionController.assignPermissionToUser);
router.route("/:id").delete(UserPermissionController.deleteUserPermissionById);
router.route("/:id").patch(UserPermissionController.updateUserPermissionById);


module.exports = router;