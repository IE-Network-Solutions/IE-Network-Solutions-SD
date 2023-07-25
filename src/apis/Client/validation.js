const joi = require("joi");

// Validate create-test api
const createClientValidator = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: joi.string().email().required(),
    department: joi.string().required(),
    company_id:joi.string(),
    user_type: joi.string().required(),
});

module.exports = createClientValidator;
