const joi = require("joi");

exports.statusValidator = joi.object({
  type: joi.string().required(),
  status_color: joi.string().required(),
});
