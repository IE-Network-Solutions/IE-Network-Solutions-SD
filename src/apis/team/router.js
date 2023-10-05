const authorize = require("../../middlewares/auth/authorization");
const teamController = require("./controller");
const router = require("express").Router();
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(authorize
    , teamController.getAllTeams);
router.route("/").post(authorize, teamController.createTeam);

module.exports = router;
