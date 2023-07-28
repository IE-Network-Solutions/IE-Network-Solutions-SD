const joi = require("joi");

// Validate create-test api
exports.createClientValidator = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  email: joi.string().email().required(),
  company_id: joi.string().required(),
});

// Validate create-ticket api
exports.createTicketValidator = joi.object({
  subject: joi.string().required(),
  description: joi.string().required(),
  priority_id: joi.string().guid({ version: "uuidv4" }).required(),
  type_id: joi.string().guid({ version: "uuidv4" }).required(),
});
