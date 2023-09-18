const AppError = require("../../utils/apperror");

const rolePermissionMiddleware = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      console.log(user);
      if (!user) {
        return next(
          new AppError("User is Not Authorized Please Login first", 401)
        );
      }

      // If user permission array is empty, return not allowed
      if (user.permissions.length === 0) {
        return next(
          new AppError("You don't have  the required permission", 401)
        );
      }

      // if user has permission check if it has the required permission
      const hasRequiredPermission = user.permissions.every((permission) =>
        requiredPermission.includes(permission.name)
      );

      if (!hasRequiredPermission) {
        return next(
          new AppError("You don't have  the required permission", 401)
        );
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };
};
module.exports = rolePermissionMiddleware;
