const router = require("express").Router();
const RoleController = require("./controller");
const createRoleValidator = require("./validation");
const validate = require("../../../utils/validator");

router.route("/").post(validate(createRoleValidator), RoleController.createOneRole);

router.route("/getAll/").post(RoleController.getAllRoles);

router.route("/findOneRoleById/:id").post(RoleController.findOneRoleById);

router.route("/findOneRoleByName/:roleName").post(RoleController.findOneRoleByName);

router.route("/:id").patch(RoleController.updateOneRoleById);

router.route("/:id").delete(RoleController.deleteOneRoleById);

module.exports = router;