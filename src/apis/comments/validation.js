const joi = require("joi");

exports.commentValidator = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  ticket_id: joi.string().guid({ version: "uuidv4" }).required(),
});

exports.ticketComments = joi.object({
  ticket_id: joi.string().guid({ version: "uuidv4" }).required(),
});
