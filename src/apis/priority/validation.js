const joi = require("joi");

exports.priorityValidator = joi.object({
  type: joi.string().required(),
  priority_color: joi.string().required(),
});
