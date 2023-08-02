const PermissionController = require('./controller');
const router = require('express').Router();
const validator = require('../../../utils/validator');
const createPermissionValidator = require('../permissions/validation');
const uuidValidator = require('../../../utils/uuidValidator');

router.route("/").get(PermissionController.getAllPermissions);
router.route("/:id").get(uuidValidator, PermissionController.getPermissionById);
router.route("/").post(validator(createPermissionValidator), PermissionController.createPermission);
router.route('/:id').patch(uuidValidator, validator(createPermissionValidator), PermissionController.updatePermission);
router.route("/:id").delete(PermissionController.deletePermission);
router.route("/user/:userId/permission/:permissionId").delete(PermissionController.deleteSpecificUserPermission);
 
module.exports = router;