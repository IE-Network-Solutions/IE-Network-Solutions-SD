const router = require("express").Router();
const UserController = require("./controller");
const validate = require("../../../utils/validator");
const {
  userValidator,
  loginValidator,
  change_password,
} = require("./validation");
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/auth/authorization");
const { uuidValidator } = require("../../../utils/uuid");
const rolePermissionMiddleware = require("../../middlewares/rolePermissionMiddleware");
const Permission = require("../../apis/permissionList/pemissions");

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

router.route("/:id").patch(
  authorize,
  uuidValidator,
  // rolePermissionMiddleware(["edit-user"]),
  uploadOptions.single("user_profile"),
  UserController.editUser
);
router
  .route("/change-password/:id")
  .patch(uuidValidator, validate(change_password), UserController.editPassword);

router
  .route("/:id")
  .delete(
    uuidValidator,
    authorize,
    rolePermissionMiddleware(["delete-user"]),
    UserController.deleteUser
  );
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
router.route("/team-access/:id").post(authorize, UserController.teamAccess);
module.exports = router;
