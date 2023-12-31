const joi = require("joi")

// validate create knowledgeBase api.
const createPermissionValidator = joi.object({
    name: joi.string().required(),
    slug: joi.string().required(),
})

module.exports = createPermissionValidator;  