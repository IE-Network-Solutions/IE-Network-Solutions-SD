const RolePermissionDAL = require("./dal");
const RoleDAL = require("../role/dal");
const PermissionDAL = require("../permissions/dal");
const AppError = require("../../../utils/apperror");
const UserPermissionDAL = require("./dal");
const UserDAL = require("../../apis/users/dal");
const uuidValidator = require("uuid-validate");
// const { is } = require('immutable');
exports.getAllUserPermission = async (req, res, next) => {
  try {
    const data = await UserPermissionDAL.getAllUserPermission();
    if (data.length == 0) {
      return next(new AppError("User Permission table is Empty"));
    } else {
      res.status(200).json({
        status: "Success",
        message: "List of User with permissions",
        data: groupAllPermissionsByUser(data),
        statusCode: 200,
      });
    }
  } catch (error) {
    console.log(error);
    return next(new AppError("Server Error", 500));
  }
};

exports.getUserPermissionById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await UserPermissionDAL.getUserPermissionById(id);
    if (!data) {
      return next(new AppError("User Permission id is Not Found"));
    }
    res.status(200).json({
      status: "Success",
      message: "List of User and permission",
      data: groupPermissionsByUserID(data),
      statusCode: 200,
    });
  } catch (error) {
    // console.log(error)
    return next(new AppError("Server Error", 500));
  }
};

const groupAllPermissionsByUser = (data) => {
  const groupPermissionsForSingleUser = {};
  data.map((userPermission) => {
    const { user_id, permission } = userPermission;
    if (!groupPermissionsForSingleUser[user_id]) {
      groupPermissionsForSingleUser[user_id] = [];
    }
    groupPermissionsForSingleUser[user_id].push(permission);
  });
  const changeGroupedPermissionsToArrayObject = Object.keys(
    groupPermissionsForSingleUser
  ).map((user_id) => ({
    user_id,
    permissions: groupPermissionsForSingleUser[user_id],
  }));
  return changeGroupedPermissionsToArrayObject;
};
const groupPermissionsByUserID = (data) => {
  const groupPermissionsForSingleUser = {};
  data.map((userPermission) => {
    const { user_id, permission } = userPermission;
    if (!groupPermissionsForSingleUser[user_id]) {
      groupPermissionsForSingleUser[user_id] = [];
    }
    groupPermissionsForSingleUser[user_id].push(permission);
  });
  const changeGroupedPermissionsToArrayObject = Object.keys(
    groupPermissionsForSingleUser
  ).map((user_id) => ({
    user_id,
    permissions: groupPermissionsForSingleUser[user_id],
  }));
  return changeGroupedPermissionsToArrayObject;
};

exports.deleteUserPermissionById = async (req, res, next) => {
  try {
    const permission = await UserPermissionDAL.deleteUserPermissionById(req.params.id);
    if (!permission) {
      return next(new AppError("User Permission is Not Found"));
    }
    res.status(200).json({
      status: "Success",
      message: "User and permission is Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(error, 500));
  }
};

exports.assignPermissionToUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const permissionsId = req.body.permissions;

    permissionsId.map((uuid) => {
      if (!uuidValidator(uuid)) {
        return next(new AppError("Invalid Permission Id", 500));
      }
    });
    const checkUserId = await UserDAL.getOneUser(userId);
    if (!checkUserId) {
      return next(new AppError("User Id NOT FOUND"));
    }

    const checkPermissions = await PermissionDAL.getPermissionsId(
      permissionsId
    );
    if (!checkPermissions) {
      return next(new AppError("Permission Id NOT FOUND"));
    }

    const userPermission = await UserPermissionDAL.assignPermissionToUser(
      userId,
      permissionsId
    );
    res.status(200).json({
      status: "Success",
      message: "List of assigned permissions to User",
      data: userPermission,
      statusCode: 201,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Server Error", 500));
  }
};

exports.updateUserRolePermissionByUserId = async (req, res, next) => {
  try {
    const { roleId, permissionsId } = req.body;

    const user = await UserDAL.getOneUser(req.params.id);
    if (!user) {
      return next(new AppError("User Not Found", 404));
    }

    const role = await RoleDAL.getRoleById(roleId);
    if (!role) {
      return next(new AppError("Role Not Found", 404));
    }

    permissionsId?.map(async (permissionId) => {
      const permission = await PermissionDAL.getPermissionById(permissionId);
      if (!permission) {
        return next(new AppError("Permission Not Found", 404));
      }
    })

    await UserPermissionDAL.updateUserRolePermissionByUserId(req.params.id, req.body);

    res.status(200).json({
      status: "Success",
      data: await UserDAL.getOneUser(req.params.id)
    });
  } catch (error) {
    console.log(error)
    return next(new AppError("Server error", 500));
  }
};
