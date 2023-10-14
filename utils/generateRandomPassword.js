function generateRandomPassword(length = 12, includeUppercase = true, includeNumbers = true, includeSpecialChars = true) {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  // const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let validChars = lowercaseChars;
  if (includeUppercase) validChars += uppercaseChars;
  if (includeNumbers) validChars += numberChars;
  // if (includeSpecialChars) validChars += specialChars;

  let password = '';
  const validCharsLength = validChars.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * validCharsLength);
    password += validChars[randomIndex];
  }

  return password;
}

module.exports = generateRandomPassword;