const router = require("express").Router();
const UserController = require("./controller");
const validate = require("../../../utils/validator");
const userValidator = require("./validation");
const auth = require("../../middlewares/auth");

router.route("/:token").get(auth.verifyToken, UserController.introduction);
router.route("/getAllUsers/:token").get(auth.verifyToken, UserController.getAllUsers);
router.route("/getOneUser/:id/:token").get(auth.verifyToken, UserController.getOneUser);

router.route("/createUser").post([auth.verifyToken, validate(userValidator)], UserController.createUser);
router.route("/editUser").post([auth.verifyToken, validate(userValidator)], UserController.editUser);

router.route("/deleteUser").delete(auth.verifyToken, UserController.deleteUser);
router.route("/deleteAllUsers/:token").delete(auth.verifyToken, UserController.deleteAllUsers);

router.route("/loginUser").post(validate(userValidator), UserController.loginUser);
router.route("/logoutUser").post([auth.verifyToken, validate(userValidator)], UserController.logoutUser);

module.exports = router;
