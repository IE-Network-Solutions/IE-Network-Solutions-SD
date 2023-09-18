const RolePermissionController = require('./controller');
const validator = require('../../../utils/validator');
const createrolePermissionValidator = require('./validation');
const router = require('express').Router();
router.route("/").get(RolePermissionController.getAllRolePermission);
router.route("/:id").get(RolePermissionController.getRolePermissionById);
router.route("/:id").post(validator(createrolePermissionValidator), RolePermissionController.assignPermissionToRole);


module.exports = router;