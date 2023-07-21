const joi = require("joi");

exports.userValidator = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  email: joi.string().email().required(),
  department: joi.string().required(),
  user_type: joi.string().required(),
});

exports.loginValidator = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});
