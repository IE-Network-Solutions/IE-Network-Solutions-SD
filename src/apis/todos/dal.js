const { getConnection } = require("typeorm");
const { Todo } = require("../../models/Todo");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const AppError = require("../../../utils/apperror");
const User = require("../../models/User");
const UserDAL = require("../users/dal");

class TodoDal {
  static async getAllTodo() {
    try {
      // get connection from the pool 
      const connection = await getConnection();

      // create a bridg 
      const todoRepository = await connection.getRepository(Todo);

      // find all todo data
      const todos = await todoRepository.find();

      // return all fetched data
      return todos;
    } catch (error) {
      throw error;
    }
  }

  static async getTodoById(id) {
    try {
      // Validate the provided UUID
      if (!uuidValidate(id)) {
        return next(new AppError("Invalid Id"));
      }

      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const todoRepository = await connection.getRepository(Todo);

      // get single todo data
      const todo = await todoRepository.findOneBy({
        id: id,
      });

      // return single todo data
      return todo;
    } catch (error) {
      throw error;
    }
  }

  static async createTodo(data) {
    try {
      const { title, description, status, due_date, user_id } = data;
      const id = uuidv4();
      // get connection from the pool
      const connection = getConnection();

      // fetch user
      const userRepository = connection.getRepository(User);
      const user = await UserDAL.getOneUser(user_id);

      // create bridge
      const todoRepository = connection.getRepository(Todo);

      // create todo
      const newTodo = await todoRepository.create({
        title,
        description,
        status,
        due_date,
        user: user,
      });
      await todoRepository.save(newTodo);

      return newTodo;
    } catch (error) {
      throw error;
    }
  }

  static async updateTest(id, updatedFields) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const todoRepository = connection.getRepository(Todo);
    const todo = await todoRepository.findOneBy({ id: id });
    if (!todo) {
      throw new Error("todo not found");
    }

    //   update the todo
    todoRepository.merge(todo, updatedFields);
    await todoRepository.save(todo);

    return todo;
  }

  static async deleteTodo(id) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const todoRepository = connection.getRepository(Todo);

    await todoRepository.delete(id);

    return "Test deleted Successfully";
  }
}

module.exports = TodoDal;
