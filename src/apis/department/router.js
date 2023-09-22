const router = require("express").Router();
const DepartmentController = require("./controller");
const { departmentValidator } = require("./validation");
const validate = require("../../../utils/validator");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(authorize, permissionMiddleware(['view-departments']), DepartmentController.getAllDepartments);
router
  .route("/:id")
  .get(authorize, permissionMiddleware(['view-department']), uuidValidator, DepartmentController.getDepartment);

router
  .route("/")
  .post(
    authorize, permissionMiddleware(['create-department']),
    validate(departmentValidator),
    DepartmentController.createDepartment
  );

router.route("/").patch(authorize, permissionMiddleware(['update-department']), DepartmentController.editDepartment);

router
  .route("/deleteAllDepartments")
  .delete(authorize, permissionMiddleware(['delete-departments']), DepartmentController.deleteAllDepartments);

router
  .route("/:id")
  .delete(authorize, permissionMiddleware(['delete-department']), uuidValidator, DepartmentController.deleteDepartment);

module.exports = router;
