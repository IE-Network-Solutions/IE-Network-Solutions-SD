const joi = require("joi");

// Validate create-Company api
const createCompanyValidator = joi.object({
  company_name: joi.string().required(),
  description: joi.string().required(),
  notes: joi.string(),
  health_score: joi.string(),
  account_tier: joi.string(),
  company_logo: joi.string(),
  is_deleted: joi.boolean(),
});

module.exports = createCompanyValidator;
