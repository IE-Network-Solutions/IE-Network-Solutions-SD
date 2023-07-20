const joi = require("joi")

// validate create knowlegebase api.
const createKnowledgebaseValidator = joi.object({ 
    title: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required()
})

module.exports = createKnowledgebaseValidator;