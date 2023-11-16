const AppError = require("../../utils/apperror");

const permissionMiddleware = (requiredPermissions = []) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return next(
          new AppError("User is Not Authorized Please Login first", 401)
        );
      }
      if (user?.user_type === "client") {
        user.permissions = ['delete-ticket', 'update-ticket'];
        next();
      }
      if (user?.permissions) {
        const hasRequiredPermission = requiredPermissions.every(requiredPermission =>
          user?.permissions
            .map(permission => permission.slug)
            .includes(requiredPermission)
        );

        if (!hasRequiredPermission) {
          return next(new AppError("You don't have the required permission(s)", 401));
        }
        next();
      }
    } catch (error) {
      return next(new AppError(error, 401));
    }
  };
};
module.exports = permissionMiddleware;
