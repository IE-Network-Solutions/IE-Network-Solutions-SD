const joi = require("joi")
const createUserPermissionValidator = joi.object({ 
    permissions : joi.array().required(),
})

module.exports = createUserPermissionValidator;  