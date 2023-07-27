const joi = require("joi");

// Validate create-Company api
const createCompanyValidator = joi.object({
    company_name: joi.string().required(),
    description: joi.string().required(),
    notes: joi.string().required(),
    health_score: joi.string().required(),
    account_tier: joi.string().required(),
    company_logo:joi.string()
});

module.exports = createCompanyValidator;
