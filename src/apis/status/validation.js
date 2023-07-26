const joi = require("joi");

exports.statusValidator = joi.object({
    id: joi.string(),
    type: joi.string().required(),
});
