const joi = require("joi");

const userSchema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: joi.string().email().required(),
    department: joi.string().required(),
    user_type: joi.string().required(),
});

module.exports = userSchema;