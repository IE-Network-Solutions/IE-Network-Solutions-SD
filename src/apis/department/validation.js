const joi = require("joi");

exports.departmentValidator = joi.object({
    id: joi.string(),
    type: joi.string().required(),
});
