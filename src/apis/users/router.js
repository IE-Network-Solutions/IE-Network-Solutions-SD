const router = require("express").Router();
const UserController = require("./controller");
const validate = require("../../../utils/validator");
const { userValidator, loginValidator } = require("./validation");
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/auth/authorization");
const { uuidValidator } = require("../../../utils/uuid");

router.route("/").get(UserController.getAllUsers);
router.route("/:id").get(UserController.getOneUser);

router
  .route("/")
  .post(validate(userValidator), UserController.createUser)
  .post(UserController.createUser);
router
  .route("/")
  .post(authorize, validate(userValidator), UserController.createUser);
  
router.route("/:id").patch(uuidValidator, authorize, UserController.editUser);

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
