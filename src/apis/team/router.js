const authorize = require("../../middlewares/auth/authorization");
const teamController = require("./controller");
const router = require("express").Router();
const permissionMiddleware = require("../../middlewares/permission.middleware");
const { uuidValidator } = require("../../../utils/uuid");

router.route("/").get(authorize
    , teamController.getAllTeams);
router.route("/").post(authorize, teamController.createTeam);

router.route("/:id")
    .get(authorize, uuidValidator, teamController.getTeamById)
    .patch(authorize, uuidValidator, teamController.updateTeamById)
    .delete(authorize, uuidValidator, teamController.deleteTeamById);


module.exports = router;
