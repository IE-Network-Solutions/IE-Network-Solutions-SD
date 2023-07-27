const AppError = require("../../../utils/apperror");
const TodoDal = require("./dal");

exports.allTodos = async (req, res, next) => {
  try {
    //   get all todos
    const todos = await TodoDal.getAllTodo();

    // check if todos data exist
    if (!todos) {
      // return custom error
      return next(new AppError("No todo data found"));
    }

    // response
    res.status(200).json({
      status: "Success",
      data: todos,
    });
  } catch (error) {
    throw error;
  }
};

exports.singleTodo = async (req, res, next) => {
  try {
    const id = req.params.id;

    // get todo with the given id
    const todo = await TodoDal.getTodoById(id);

    if (!todo) return next(new AppError("Todo with the given id not found"));

    res.status(200).json({
      status: "Success",
      data: todo,
    });
  } catch (error) {
    throw error;
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(req.user);
    data.user_id = req.user.id;

    //   create new todo
    const todo = await TodoDal.createTodo(data);

    // retrn created todo
    res.status(201).json({
      status: "Success",
      data: todo,
    });
  } catch (error) {
    throw error;
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if todo exist or not
    const todoData = await TodoDal.getTodoById(id);

    if (!todoData)
      return next(new AppError("Todo with the given id not found"));

    const todo = await TodoDal.updateTest(id, updatedFields);

    res.status(200).json({
      status: "Success",
      data: todo,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const id = req.params.id;

    // validate if todo exist or not
    const todoData = await TodoDal.getTodoById(id);

    if (!todoData)
      return next(new AppError("Todo with the given id not found"));

    await TodoDal.deleteTodo(id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};
