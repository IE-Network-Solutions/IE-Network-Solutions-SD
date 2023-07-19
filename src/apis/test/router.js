const router = require("express").Router();
const TestController = require("./controller");
const createTestValidator = require("./validation");
const validate = require("../../../utils/validator");

router.route("/").get(TestController.allTests);
router
  .route("/")
  .post(validate(createTestValidator), TestController.createTest);
router.route("/:id").get(TestController.singleTest);
router.route("/:id").patch(TestController.updateTests);
router.route("/:id").delete(TestController.deleteTest);

module.exports = router; 
