const joi = require("joi")

// validate create knowledgeBase api.
const createPermissionValidator = joi.object({ 
    create: joi.boolean().required(),
    update: joi.boolean().required(),
    view: joi.boolean().required(),
    delete: joi.boolean().required(),
})

module.exports = createPermissionValidator;