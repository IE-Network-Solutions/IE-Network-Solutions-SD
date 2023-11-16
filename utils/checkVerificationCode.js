const checkVerificationCode = async (existingCode, incommingCode) => {
    return existingCode === incommingCode ? true : false;
}

module.exports = { checkVerificationCode };
