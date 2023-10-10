const router = require("express").Router();
const authorize = require("../../middlewares/auth/authorization");
const RoleController = require("./controller");

const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(
  authorize, RoleController.getAllRoles);
router.route("/:id").get(
  authorize, RoleController.getRoleById);
router.route("/").post(
  authorize, permissionMiddleware(['create-role']), RoleController.createRole);
router
  .route("/findOneRoleByName/:roleName")
  .post(
    authorize, permissionMiddleware(['view-role-by-name']), RoleController.findOneRoleByName);
router.route("/:id").patch(
  authorize, permissionMiddleware(['update-role']), RoleController.updateRoleById);
router.route("/:id").delete(
  authorize, permissionMiddleware(['delete-role']), RoleController.deleteRoleById);

module.exports = router;
