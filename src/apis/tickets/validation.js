const joi = require("joi");

// Validate create-test api
const createTestValidator = joi.object({
  subject: joi.string().required(),
  status: joi.string().required(),
  description: joi.string().required(),
  priority: joi.string().required(),
  userId : joi.number().required(),
  assignedToId: joi.string().required()
});

module.exports = createTestValidator;
