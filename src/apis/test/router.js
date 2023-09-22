const router = require("express").Router();
const TestController = require("./controller");
const createTestValidator = require("./validation");
const validate = require("../../../utils/validator");
const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(authorize, permissionMiddleware(['view-tests']), TestController.allTests);
router
  .route("/")
  .post(authorize, permissionMiddleware(['create-test']), validate(createTestValidator), TestController.createTest);
router.route("/:id").get(authorize, permissionMiddleware(['view-test']), TestController.singleTest);
router.route("/:id").patch(authorize, permissionMiddleware(['update-test']), TestController.updateTests);
router.route("/:id").delete(authorize, permissionMiddleware(['delete-test']), TestController.deleteTest);

module.exports = router; 
