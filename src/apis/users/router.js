const router = require("express").Router();
const UserController = require("./controller");
const validate = require("../../../utils/validator");
const { userValidator, loginValidator } = require("./validation");
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/auth/authorization");
const { uuidValidator } = require("../../../utils/uuid");
const rolePermissionMiddleware = require('../../middlewares/rolePermissionMiddleware');
const Permission = require('../../apis/permissionList/pemissions');
const tokenBlacklist = require('../../middlewares/blackList');

router.route("/").get(authorize, rolePermissionMiddleware([...Permission.userPermissions]), UserController.getAllUsers);
router.route("/:id").get(authorize, rolePermissionMiddleware([...Permission.userPermissions]), UserController.getOneUser);
router.route("/").post(validate(userValidator), UserController.createUser);
router.route("/:id").patch(uuidValidator, authorize, rolePermissionMiddleware([...Permission.userPermissions]), UserController.editUser);
router.route("/:id").delete(uuidValidator, authorize, rolePermissionMiddleware([...Permission.userPermissions]), UserController.deleteUser);
router.route("/deleteAllUsers/:id").delete(uuidValidator, authorize, rolePermissionMiddleware([...Permission.userPermissions]), UserController.deleteAllUsers);
router.route("/login").post(validate(loginValidator), UserController.loginUser);
router.route("/resetPassword").post(authorize, authorize, rolePermissionMiddleware([...Permission.userPermissions]), UserController.resetPassword);
router.route("/forgotPassword").post(authorize, rolePermissionMiddleware([...Permission.userPermissions]), UserController.forgotPassword);
router.route("/logout").post(async (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token)
  if (token) {
    return res.status(400).json({ message: 'Token not provided.' });
  }

  // Add the token to the blacklist 
  //   tokenBlacklist.add(token);

  res.json({ message: 'Logged out successfully.' });
});
module.exports = router;
