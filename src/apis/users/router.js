const router = require("express").Router();
const UserController = require("./controller");
const validate = require("../../../utils/validator");
const { userValidator, loginValidator } = require("./validation");
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/auth/authorization");
const { uuidValidator } = require("../../../utils/uuid");
const rolePermissionMiddleware = require("../../middlewares/rolePermissionMiddleware");
const Permission = require("../../apis/permissionList/pemissions");
const tokenBlacklist = require("../../middlewares/blackList");

const { uploadOptions } = require("../../../utils/imageUpload");

router.route("/").get(UserController.getAllUsers);
router
  .route("/user-data")
  .get(
    authorize,
    uploadOptions.single("user_profile"),
    UserController.getLoggedUserData
  );

router.route("/:id").get(authorize, uuidValidator, UserController.getOneUser);

router
  .route("/")
  .post(uploadOptions.single("user_profile"), UserController.createUser);

router
  .route("/:id")
  .patch(
    uuidValidator,
    uploadOptions.single("user_profile"),
    UserController.editUser
  );

router
  .route("/:id")
  .delete(uuidValidator, authorize, UserController.deleteUser);
router
  .route("/deleteAllUsers/:id")
  .delete(uuidValidator, authorize, UserController.deleteAllUsers);
router.route("/login").post(validate(loginValidator), UserController.loginUser);
router
  .route("/resetPassword")
  .post(
    authorize,
    authorize,
    rolePermissionMiddleware([...Permission.userPermissions]),
    UserController.resetPassword
  );
router
  .route("/forgotPassword")
  .post(
    authorize,
    rolePermissionMiddleware([...Permission.userPermissions]),
    UserController.forgotPassword
  );
router.route("/logout").post(async (req, res, next) => {
  const token = req.headers["authorization"];
  console.log(token);
  if (token) {
    return res.status(400).json({ message: "Token not provided." });
  }
  res.json({ message: "Logged out successfully." });
});
module.exports = router;
