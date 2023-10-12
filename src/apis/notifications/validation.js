const joi = require("joi");

exports.noteValidator = joi.object({
  id: joi.string(),
  title: joi.string().required(),
  message: joi.string().required(),
  from: joi.string().email().required(),
  user_id: joi.string().guid(),
  isRead: joi.boolean().required()
});
