const validateUuid = require("uuid-validate");
const AppError = require("./apperror");

const UU = async (req, res, next) => {
  const id = req.params.id;
  if (!validateUuid(id)) return next(new AppError("Invalid Id"));
  next();
};

module.exports=UU
