const AppError = require("../../utils/apperror");
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_TOKEN = process.env.JWT_TOKEN;

async function signJWT(req, res, next) {
    let user = {

    }
    const token = jwt.sign(user, JWT_TOKEN, {expiresIn: "2d"});
    return next();
}

async function verifyToken(req, res, next)  {
    const token = req.body.token || req.query.token || req.headers["auth-token"];
    if (!token) {
        return next(new AppError("A token is required for authentication", 403))
    }
    try {
        const decoded = jwt.verify(token, JWT_TOKEN);
        if (decoded.disabled) {
            return next(new AppError("Your account has been deactivated. Please contact the admins!", 404))
        }
        req.user = decoded;
    } catch (err) {
        return next(new AppError("Unauthorized user please login first", 401))
    }
    return next();
}

module.exports = { 
    verifyToken,
    signJWT,
}