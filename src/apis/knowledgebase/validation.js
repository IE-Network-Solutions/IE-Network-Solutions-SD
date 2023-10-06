const joi = require("joi")

// validate create knowledgeBase api.
const createKnowledgeBaseValidator = joi.object({
    title: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().required(),
    createdBy: joi.string().guid().required(),
    catagoryId: joi.string().guid().required()
})

module.exports = createKnowledgeBaseValidator;