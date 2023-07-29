const router = require("express").Router();
const UserController = require("./controller");
const validate = require("../../../utils/validator");
const { userValidator, loginValidator } = require("./validation");
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/auth/authorization");
const { uuidValidator } = require("../../../utils/uuid");
const rolePermissionMiddleware = require('../../middlewares/rolePermissionMiddleware');

router.route("/").get(authorize, rolePermissionMiddleware(["view-users","delete-users","update-user"]), UserController.getAllUsers);
router.route("/:id").get(authorize, rolePermissionMiddleware(["delete-users","update-user"]), UserController.getOneUser);
router.route("/").post(validate(userValidator), UserController.createUser);
router.route("/:id").patch(uuidValidator, authorize, authorize, rolePermissionMiddleware(["view-users","delete-users","update-user"]), UserController.editUser);
router.route("/:id").delete(uuidValidator, authorize, UserController.deleteUser);
router.route("/deleteAllUsers/:id").delete(uuidValidator, authorize,authorize, rolePermissionMiddleware(["view-users","delete-users","update-user"]), UserController.deleteAllUsers);
router.route("/login").post(validate(loginValidator), UserController.loginUser);
router.route("/resetPassword").post(authorize, authorize, rolePermissionMiddleware(["view-users","delete-users","update-user"]),UserController.resetPassword);
router.route("/forgotPassword").post(authorize, authorize, rolePermissionMiddleware(["view-users","delete-users","update-user"]),UserController.forgotPassword);
router.route("/logout").post(UserController.logOut);
module.exports = router;
