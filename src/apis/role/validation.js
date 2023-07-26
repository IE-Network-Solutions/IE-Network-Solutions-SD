const joi = require("joi");

exports.roleValidator = joi.object({
  roleName: joi.string().required(),
});
