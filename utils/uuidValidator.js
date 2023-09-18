const uuidValidate = require('uuid-validate');
const AppError = require("./apperror");

const uuidValidetor = async (req, res, next)=>{
      const id = req.params.id;
      if (!uuidValidate(id)) return next(new AppError("Your Id is Not Correct, Please use valid Id"));
      next();
}

module.exports = uuidValidetor;