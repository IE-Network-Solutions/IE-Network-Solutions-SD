const AppError = require("../../../utils/apperror");
const RoleDAL = require("./dal");

exports.createOneRole = async (req, res, next) => {
  try {
    // get input data.
    const data = req.body;

    // Check for the uniqueness of the role name.
    const role = await RoleDAL.findOneRoleByName(data.roleName);
    if (role) return next(new AppError("role name must be unique.", 406));
    //   create new role
    const createdRole = await RoleDAL.createOneRole(data);

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
      // return custom error
      return next(new AppError("No Role data found."));
    }

    res.status(200).json({
      status: "Success",
      data: roles,
    });
  } catch (error) {
    throw error;
  }
};

exports.findOneRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // get one role its id.
    const role = await RoleDAL.findOneRoleById(id);

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
      return next(new AppError("Role with the given roleName is not found.", 404));
    }

    res.status(200).json({
      status: "Success",
      data: role,
    });
  } catch (error) {
    throw error;
  }
};

exports.updateOneRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if role with the given id is found or not?
    const checkRole = await RoleDAL.findOneRoleById(id);

    if (!checkRole) {
      return next(new AppError("Role with the given id is not found.", 404));
    }

    let updatedRole;

    // check for the uniqueness of the role name.
    if (checkRole.roleName === updatedFields.roleName) {
      // here we are updating by the same name.
      // So, the roleName will be unique.
      updatedRole = await RoleDAL.updateOneRoleById(id, updatedFields);
    } else {
      const roleExist = await RoleDAL.findOneRoleByName(updatedFields.roleName);
      if (!roleExist ||  !updatedFields.roleName) {
        updatedRole = await RoleDAL.updateOneRoleById(id, updatedFields);
      } else {
        return next(new AppError("Role name must be unique.", 406));
      }
    }

    res.status(200).json({
      status: "Success",
      data: updatedRole,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteOneRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // check if Role with the given id is found or not?
    const checkRole = await RoleDAL.findOneRoleById(id);

    if (!checkRole) {
      return next(new AppError("Role with the given id is not found.", 404));
    }

    await RoleDAL.deleteOneRoleById(id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};
