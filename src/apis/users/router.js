const router = require("express").Router();
const UserController = require("./controller");
const validate = require("../../../utils/validator");
const { userValidator, loginValidator } = require("./validation");
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/auth/authorization");
const { uuidValidator } = require("../../../utils/uuid");
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
    authorize,
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

router.route("/resetPassword").post(UserController.resetPassword);
router.route("/forgotPassword").post(UserController.forgotPassword);

module.exports = router;
