const validateUuid = require("uuid-validate");
const AppError = require("./apperror");

exports.uuidValidator = async (req, res, next) => {
  const id = req.params.id;
  if (!validateUuid(id)) {
    return next(new AppError("Invalid Id", 500));
  }
  next();
};

// exports.multipleUuid = (uuids) => {
//   uuids.map((uuid) => {
//     if (!validateUuid(uuid)) {
//       return next(new AppError("Invalid Id", 500));
//     }
//   });
//   next();
// };
