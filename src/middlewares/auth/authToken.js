const AppError = require("../../../utils/apperror");

/**
 * a function to check the authorized token
 */
const authToken = (req, next) => {
  let token;
  // check if the token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // console.log(req.header.authorization.split(" ")[0]);
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new AppError("Please Login!", 401));
    }
    return token;
  } else {
    return next(new AppError("Please Login!", 401));
  }
};

// export authToken
module.exports = authToken;
