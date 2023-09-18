const joi = require("joi")
const createrolePermissionValidator = joi.object({ 
    permissions : joi.array().required(),
})

module.exports = createrolePermissionValidator;  