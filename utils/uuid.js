const uuidVAlidator = require("uuid-validate");
const AppError = require("./apperror");

const generateUUID = async (req, res, next) => {
  const id = req.params.id;
  if (!uuidVAlidator(id)) {
    return next(new AppError("Invalid Id", 500));
  }
  next();
};

module.exports = generateUUID;
