const router = require("express").Router();
const UserController = require("./controller");
const validate = require("../../../utils/validator");
const userValidator = require("./validation");

router.route("/").get(UserController.introduction);
router.route("/getAllUsers").get(UserController.getAllUsers);
router.route("/getOneUser/:id").get(UserController.getOneUser);

router.route("/createUser").post(validate(userValidator), UserController.createUser);
router.route("/editUser").post(validate(userValidator), UserController.editUser);

router.route("/deleteUser").delete(UserController.deleteUser);
router.route("/deleteAllUsers").delete(UserController.deleteAllUsers);

router.route("/loginUser").post(validate(userValidator), UserController.loginUser);
router.route("/logoutUser").post(validate(userValidator), UserController.logoutUser);

module.exports = router;
