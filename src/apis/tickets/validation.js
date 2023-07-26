const joi = require("joi");

// Validate create-test api
exports.createTicketValidator = joi.object({
  subject: joi.string().required(),
  description: joi.string().required(),
  priority_id: joi.string().required(),
  department_id: joi.string().required(),
  status_id: joi.string().required(),
  type_id: joi.string().required(),
});

// Validate update-test api
exports.updateTicketValidator = joi.object({
  subject: joi.string(),
  description: joi.string(),
  priority_id: joi.string().guid({ version: "uuidv4" }),
  department_id: joi.string().guid({ version: "uuidv4" }),
  status_id: joi.string().guid({ version: "uuidv4" }),
  type_id: joi.string().guid({ version: "uuidv4" }),
});

exports.assignTicket = joi.object({
  users: joi.array().required(),
});
