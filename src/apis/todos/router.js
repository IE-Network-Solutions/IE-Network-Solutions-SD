const router = require("express").Router();
const TodoController = require("./controller");
const createTodoValidator = require("./validation");
const validate = require("../../../utils/validator");
const authorize = require("../../middlewares/auth/authorization");

const permissionMiddleware = require("../../middlewares/permission.middleware");


router.route("/").get(authorize, permissionMiddleware(['view-todos']), TodoController.allTodos);
router.route("/").post(authorize, permissionMiddleware(['create-todo']), validate(createTodoValidator), TodoController.createTodo);
router.route("/:id").get(authorize, permissionMiddleware(['view-todo']), TodoController.singleTodo);
router.route("/:id").patch(authorize, permissionMiddleware(['update-todo']), TodoController.updateTodo);
router.route("/:id").delete(authorize, permissionMiddleware(['delete-todo']), TodoController.deleteTodo);

module.exports = router;
