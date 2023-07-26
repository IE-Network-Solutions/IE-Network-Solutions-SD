const joi = require("joi")

// validate create knowledgeBase api.
const createKnowledgeBaseValidator = joi.object({ 
    title: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    // user_id: joi.string().required()
})

module.exports = createKnowledgeBaseValidator;