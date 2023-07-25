const router = require("express").Router();
const TypeController = require("./controller");
const typeValidator = require("./validation");
const validate = require("../../../utils/validator");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(TypeController.getAllTypes);
router.route("/:id").get(uuidValidator, TypeController.getOneType);

router.route("/").post(TypeController.createType);

router.route("/").patch(TypeController.editType);

router.route("/deleteAllTypes").delete(TypeController.deleteAllTypes);

router.route("/:id").delete(uuidValidator, TypeController.deleteType);

module.exports = router;
