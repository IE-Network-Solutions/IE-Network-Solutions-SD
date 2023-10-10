const router = require("express").Router();
const seedPermissionsController = require("./controller");

router.route("/")
    .post(seedPermissionsController.seedPermissions);


module.exports = router;