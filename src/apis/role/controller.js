const AppError = require("../../../utils/apperror");
const RoleDAL = require("./dal");

exports.createRole = async (req, res, next) => {
  try {
    // get input data.
    const data = req.body;

    // Check for the uniqueness of the role name.
    const role = await RoleDAL.findOneRoleByName(data.roleName);
    if (role) return next(new AppError("role name must be unique.", 406));

    //   create new role
    const createdRole = await RoleDAL.createRole(data);

    // Create/give least permission on all seeded resources in the system for newly created role,
    // then the admin will update it latter as necessary.
    // await RoleDAL.createManyPermissions(createdRole.id);

    res.status(201).json({
      status: "Success",
      data: createdRole,
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllRoles = async (req, res, next) => {
  try {
    // get all role.
    const roles = await RoleDAL.getAllRole();

    // check if Role doesn't exist.

    if (!roles) {
      return next(new AppError("No Role data found."));
    }
    res.status(200).json({
      status: "Success",
      data: roles,
    });
  } catch (error) {
    console.log(error)
    return next(new AppError("Server Error", 500));
  }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // get one role its id.
    const role = await RoleDAL.getRoleById(id);

    if (!role) {
      return next(new AppError("Role with the given id is not found.", 404));
    }

    res.status(200).json({
      status: "Success",
      data: role,
    });
  } catch (error) {
    throw error;
  }
};

exports.findOneRoleByName = async (req, res, next) => {
  try {
    const roleName = req.params.roleName;

    // get one role its name.
    const role = await RoleDAL.findOneRoleByName(roleName);

    if (!role) {
      return next(
        new AppError("Role with the given roleName is not found.", 404)
      );
    }

    res.status(200).json({
      status: "Success",
      data: role,
    });
  } catch (error) {
    throw error;
  }
};

exports.updateRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if role with the given id is found or not?
    const checkRole = await RoleDAL.getRoleById(id);
    console.log(checkRole)

    if (!checkRole) {
      return next(new AppError("Role with the given id is not found.", 404));
    }

    const role = await RoleDAL.updateRoleById(id, updatedFields);
    let updatedRole;

    // check for the uniqueness of the role name.
    if (checkRole.roleName === updatedFields.roleName) {
      // here we are updating by the same name.
      // So, the roleName will be unique.
      updatedRole = await RoleDAL.updateOneRoleById(id, updatedFields);
    } else {
      const roleExist = await RoleDAL.findOneRoleByName(updatedFields.roleName);
      if (!roleExist || !updatedFields.roleName) {
        updatedRole = await RoleDAL.updateOneRoleById(id, updatedFields);
      } else {
        return next(new AppError("Role name must be unique.", 406));
      }
    }

    res.status(200).json({
      status: "Success",
      message: "Role is Successfully updated",
      data: role,
    });
  } catch (error) {
    return next(new AppError("Server error", 500))
  }
};

exports.deleteRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // check if Role with the given id is found or not?
    const role = await RoleDAL.getRoleById(id);
    if (!role) {
      return next(new AppError("Role with the given id is not found.", 404));
    }
    const deletedRole = await RoleDAL.deleteRoleById(id);
    console.log(deletedRole);
    res.status(200).json({
      status: "Success",
      message: "Role is deleted successfully",
    });
  } catch (error) {
    return next(new AppError("Server Error"));
  }
};
