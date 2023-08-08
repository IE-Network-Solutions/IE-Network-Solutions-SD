const joi = require("joi");

exports.departmentValidator = joi.object({
  type: joi.string().required(),
  department_lead_id: joi.string().guid({ version: "uuidv4" }).required(),
});
