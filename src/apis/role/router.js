const router = require("express").Router();
const authorize = require("../../middlewares/auth/authorization");
const { getAll, createRole, getRole } = require("./controller");
const { roleValidator } = require("./validation");
const validate = require("../../../utils/validator");
const { uuidValidator } = require("../../../utils/uuid");

router.route("/").get(authorize, getAll);
router.route("/:id").get(uuidValidator, authorize, getRole);
router.route("/").post(authorize, validate(roleValidator), createRole);

module.exports = router;
