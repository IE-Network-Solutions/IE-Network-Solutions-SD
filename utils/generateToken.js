const jwt = require("jsonwebtoken");
const configs = require("../utils/configs");

/**
 * Generate a jwt
 */
const createToken = (payload) => {
  const payloadValues = { id: payload.id };
  const token = jwt.sign(payloadValues, configs.jwt.secret, {
    expiresIn: configs.jwt.expiresIn,
  });
  // Return the token
  return token;
};

// Export createToken()
module.exports = createToken;
