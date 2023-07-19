const joi = require("joi");

// Validate create-test api
const createClientValidator = joi.object({
    first_name: joi.string().required("First Name is Required!"),
    last_name: joi.string().required("Last Name is Required!"),
    email: joi.string().email().required("Email is Required!"),
    role: joi.string().required("Role is Required!"),
    department: joi.string().required("Department is Required!"),
    user_type: joi.string().required("User Type is Required"),
});

module.exports = createClientValidator;
