const router = require("express").Router();
const UserController = require("./controller");
const validate = require("../../../utils/validator");
const { userValidator, loginValidator } = require("./validation");
const auth = require("../../middlewares/auth");
const authorize = require("../../middlewares/auth/authorization");
const { uuidValidator } = require("../../../utils/uuid");

router.route("/").get(authorize, UserController.getAllUsers);
router.route("/:id").get(uuidValidator, authorize, UserController.getOneUser);

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
router
  .route("/logout")
  .post([authorize, validate(userValidator)], UserController.logoutUser);

module.exports = router;
