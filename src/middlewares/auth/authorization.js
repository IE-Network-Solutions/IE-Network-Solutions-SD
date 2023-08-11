const AppError = require("../../../utils/apperror");
const jwt = require("jsonwebtoken");
const authToken = require("./authToken");
const configs = require("../../../utils/configs");
const UserDAL = require("../../apis/users/dal");

/**
 * a middleware to chack if user can access the route or not
 */

const authorize = async (req, res, next) => {
  try {
    // get authorized token from header
    const token = authToken(req, next);

    //   verify the token which returns the payload consisting the user id
    const verifyToken = jwt.verify(token, configs.jwt.secret);
    if (!verifyToken) {
      return next(new AppError("Please Login!", 401));
    }
    //   fetch user by payload user id
    const user = await UserDAL.getOneUser(verifyToken.id);
    if (!user || user.is_deleted == true)
      return next(new AppError("user not found", 400));
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Please Login!", 401));
  }
};

// export authorized
module.exports = authorize;
