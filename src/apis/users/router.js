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
const Permission = require("../../apis/permissionList/pemissions");

const { uploadOptions } = require("../../../utils/imageUpload");

const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(authorize, permissionMiddleware(['view-users']), UserController.getAllUsers);
router
  .route("/user-data")
  .get(
    authorize, permissionMiddleware(['view-logged-in-user-data']),
    uploadOptions.single("user_profile"),
    UserController.getLoggedUserData
  );

router.route("/:id").get(uuidValidator, UserController.getOneUser);

router
  .route("/")
  .post(uploadOptions.single("user_profile"), UserController.createUser);

router.route("/:id").patch(
  authorize, uuidValidator, uploadOptions.single("user_profile"), UserController.editUser);
router
  .route("/change-password/:id")
  .patch(authorize, permissionMiddleware(['change-user-password']), uuidValidator, validate(change_password), UserController.editPassword);

router
  .route("/:id")
  .delete(
    authorize, uuidValidator, UserController.deleteUser);
router
  .route("/deleteAllUsers/:id")
  .delete(authorize, permissionMiddleware(['delete-users']), uuidValidator, UserController.deleteAllUsers);
router.route("/login").post(validate(loginValidator), UserController.loginUser);
router
  .route("/resetPassword")
  .post(authorize, permissionMiddleware(['reset-user-password']), UserController.resetPassword);
router
  .route("/forgotPassword")
  .post(
    authorize, permissionMiddleware(['forget-user-password']), UserController.forgotPassword);

router.route("/logout").post(authorize, UserController.logout);

router.route("/team-access/:id").post(authorize, UserController.teamAccess);
router.route("/sendChangePasswordAlertByEmail").post(authorize, UserController.sendChangePasswordAlertByEmail);
router.route("/sendChangePasswordRequest/:id").patch(UserController.sendChangePasswordRequest);
router.route("/checkVerificationCode").post(authorize, UserController.checkVerificationCode);

module.exports = router;
