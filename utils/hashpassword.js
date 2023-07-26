const bcrypt = require("bcryptjs");

/**
 * file to hash password during signup
 */

// Generate a salt with a cost factor of 10 (higher cost means more secure, but slower)
const saltRounds = 10;

// const hash = (password) => {
//   // Generate the salt
//   return bcrypt.genSalt(saltRounds, (err, salt) => {
//     if (err) {
//       throw err;
//     }

//     // Hash the password with the generated salt
//     bcrypt.hash(password, salt, (err, hash) => {
//       if (err) {
//         throw err;
//       }
//     });
//   });
// };

const hash = (pass) => {
  return bcrypt.hashSync(pass, 10);
};

module.exports = hash;
