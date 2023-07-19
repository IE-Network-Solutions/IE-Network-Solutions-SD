const joi = require("joi");

// Validate create-test api
const createTestValidator = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  age: joi.number(),
});

module.exports = createTestValidator;
