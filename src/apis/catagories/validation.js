const joi = require("joi")

// validate create knowlegebase api.
const catagoryValidator = joi.object({ 
    name: joi.string().required(),
    description: joi.string().required(),

})

module.exports = catagoryValidator;