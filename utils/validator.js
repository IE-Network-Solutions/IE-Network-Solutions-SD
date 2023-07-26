const AppError = require("./apperror");

const validator = (joiSchema) => {
  return (req, res, next) => {
    const { value, error } = joiSchema.validate(req.body);
    if (error) return next(new AppError(error.message, 400));
    next();
  };

};

module.exports = validator;
