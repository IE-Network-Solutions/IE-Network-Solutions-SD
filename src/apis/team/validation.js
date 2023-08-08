const joi = require("joi");

exports.teamValidation = joi.object({
  name: joi.string().required(),
  team_lead_id: joi.string().guid({ version: "uuidv4" }),
  department_id: joi.string().guid({ version: "uuidv4" }),
});
