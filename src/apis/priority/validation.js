const joi = require("joi");

exports.priorityValidator = joi.object({
    id: joi.string(),
    type: joi.string().required(),
});
