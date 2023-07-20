const bcrypt = require("bcryptjs");

/**
 * a function to compare req passward and bycrybt pass
 */

const checkHash = (incomingPassword, hashedPassword) => {
  return bcrypt.compareSync(incomingPassword.toString(), hashedPassword);
};

//export checkHash
module.exports = checkHash;
