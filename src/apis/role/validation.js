// const joi = require("joi");

// exports.roleValidator = joi.object({
//   roleName: joi.string().required(),
// });
const joi = require("joi");

// Validate createRole api
const createRoleValidator = joi.object({
  roleName: joi.string().required(),
});

module.exports = createRoleValidator;
