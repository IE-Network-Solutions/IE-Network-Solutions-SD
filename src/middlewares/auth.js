const AppError = require("../../utils/apperror");
const jwt = require('jsonwebtoken');
const { error } = require("../apis/users/validation");
require('dotenv').config();

const JWT_TOKEN = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

exports.signJWT = async (data) => {
    try {
        let user = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            role: data.role,
            department: data.department,
            user_type: data.user_type,
        }
        let token = jwt.sign(user, JWT_TOKEN, {expiresIn: JWT_EXPIRES_IN.toString()});
        return token;
    } catch (error) {
        throw error;
    }
}

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.params.token || req.headers["auth-token"];
        if (!token) {
            return next(new AppError("A token is required for authentication", 403))
        }
        jwt.verify(token, JWT_TOKEN, (error, user) => {
            if (error) return next(new AppError("Unauthorized user please login first!", 401));
            req.user = user;
        });
        return next();
    } catch (error) {
        throw error;
    }
}
