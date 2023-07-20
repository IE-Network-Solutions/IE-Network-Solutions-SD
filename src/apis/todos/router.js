const router = require("express").Router();
const TodoController = require("./controller");
const createTodoValidator = require("./validation");
const validate = require("../../../utils/validator");

router.route("/").get(TodoController.allTodos);
router
  .route("/")
  .post(validate(createTodoValidator), TodoController.createTodo);
router.route("/:id").get(TodoController.singleTodo);
router.route("/:id").patch(TodoController.updateTodo);
router.route("/:id").delete(TodoController.deleteTodo);

module.exports = router;