const joi = require("joi");

// Validate create-test api
exports.createTicketValidator = joi.object({
  subject: joi.string().required(),
  description: joi.string().required(),
  // priority_id: joi.string().guid({ version: "uuidv4" }).required(),
  team_id: joi.string().guid({ version: "uuidv4" }),
  // status_id: joi.string().guid({ version: "uuidv4" }).required(),
  type_id: joi.string().guid({ version: "uuidv4" }).required(),
  client_id: joi.string().guid({ version: "uuidv4" }),
});

// Validate update-test api
exports.updateTicketValidator = joi.object({
  subject: joi.string(),
  description: joi.string(),
  priority_id: joi.string().guid({ version: "uuidv4" }),
  department_id: joi.string().guid({ version: "uuidv4" }),
  status_id: joi.string().guid({ version: "uuidv4" }),
  type_id: joi.string().guid({ version: "uuidv4" }),
  team_id: joi.string().guid({ version: "uuidv4" }),
  client_id: joi.string().guid({ version: "uuidv4" }),
  due_date: joi.date(),
  closed: joi.boolean(),
  is_deleted: joi.boolean(),
});

exports.assignTicket = joi.object({
  users: joi.array().required(),
});
