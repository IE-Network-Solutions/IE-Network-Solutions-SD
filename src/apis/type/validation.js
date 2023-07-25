const joi = require("joi");

exports.typeValidator = joi.object({
  id: joi.string(),
  type: joi.string().required(),
});
