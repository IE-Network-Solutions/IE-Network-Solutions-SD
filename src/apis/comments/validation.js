const joi = require("joi");

exports.commentValidator = joi.object({
    id: joi.string(),
    title: joi.string().required(),
    description: joi.string().required(),
});
