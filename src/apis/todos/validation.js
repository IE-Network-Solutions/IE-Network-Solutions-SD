const joi = require("joi");

// Validate create-todo api
const createTodoValidator = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  due_date: joi.date().required(),
});

module.exports = createTodoValidator;
