const joi = require("joi");

// Validate create-test api
exports.createTicketValidator = joi.object({
  subject: joi.string().required(),
  status: joi.string().required(),
  description: joi.string().required(),
  priority: joi.string().required(),
});

exports.assignTicket = joi.object({
  users: joi.array().required(),
});
