const router = require("express").Router();
const UserController = require("./controller");

router.route("/").get(UserController.introduction);
router.route("/getAllUsers").get(UserController.getAllUsers);
router.route("/getOneUser/:id").get(UserController.getOneUser);

router.route("/createUser").post(UserController.createUser);

router.route("/deleteUser").delete(UserController.deleteUser);
router.route("/deleteAllUsers").delete(UserController.deleteAllUsers);

router.route("/editUser").post(UserController.editUser);
router.route("/loginUser").post(UserController.loginUser);
router.route("/logoutUser").post(UserController.logoutUser);

module.exports = router;
