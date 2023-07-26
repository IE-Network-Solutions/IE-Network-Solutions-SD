const joi = require("joi");

exports.noteValidator = joi.object({
  id: joi.string(),
  body: joi.string().required(),
});
