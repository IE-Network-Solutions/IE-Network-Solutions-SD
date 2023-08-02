const router = require("express").Router();
const RoleController = require("./controller");

router.route("/").get(RoleController.getAllRoles);
router.route("/:id").get(RoleController.getRoleById);
router.route("/").post(RoleController.createRole);
router.route("/findOneRoleByName/:roleName").post(RoleController.findOneRoleByName);
router.route("/:id").patch(RoleController.updateRoleById);
router.route("/:id").delete(RoleController.deleteRoleById);

module.exports = router;