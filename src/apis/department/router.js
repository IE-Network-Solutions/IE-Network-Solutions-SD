const router = require("express").Router();
const DepartmentController = require("./controller");
const { departmentValidator } = require("./validation");
const validate = require("../../../utils/validator");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(authorize, DepartmentController.getAllDepartments);
router
  .route("/:id")
  .get(authorize, uuidValidator, DepartmentController.getDepartment);

router
  .route("/")
  .post(
    authorize,
    validate(departmentValidator),
    DepartmentController.createDepartment
  );

router.route("/").patch(authorize, DepartmentController.editDepartment);

router
  .route("/deleteAllDepartments")
  .delete(authorize, DepartmentController.deleteAllDepartments);

router
  .route("/:id")
  .delete(authorize, uuidValidator, DepartmentController.deleteDepartment);

module.exports = router;
