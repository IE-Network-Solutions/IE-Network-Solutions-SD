const joi = require("joi");

exports.userValidator = joi.object({
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  email: joi.string().email().required(),
  user_type: joi.string().required(),
  role_id: joi.string().guid(),
  permission_id: joi.string().guid(),
  department_id: joi.string(),
  password: joi.string(),
  old_password: joi.string(),
  is_deleted: joi.boolean(),
});
exports.change_password = joi.object({
  password: joi.string().required(),
  old_password: joi.string().required(),
});
exports.loginValidator = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});
