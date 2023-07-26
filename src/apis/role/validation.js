const joi = require("joi");

// Validate createRole api
const createRoleValidator = joi.object({
  roleName: joi.string().required(), 
});

module.exports = createRoleValidator;