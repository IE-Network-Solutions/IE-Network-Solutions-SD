const AppError = require("../../../utils/apperror");
const RoleDAL = require("./dal");

exports.getAll = async (req, res, next) => {
  try {
    const { page } = req.query;

    // parse the query data
    const pageNumber = parseInt(page, 10) || 1;

    //   get all data
    const roles = await RoleDAL.getAllRoles(pageNumber);

    // response
    res.status(200).json({
      status: "Success",
      data: roles,
    });
  } catch (error) {
    throw error;
  }
};

exports.getRole = async (req, res, next) => {
  try {
    const id = req.params;

    const role = await RoleDAL.getSingleRole(id);
    if (!role)
      return next(new AppError("role with this id does not exist", 404));

    res.status(200).json({
      status: "Success",
      data: role,
    });
  } catch (error) {
    throw error;
  }
};

exports.createRole = async (req, res, next) => {
  try {
    const data = req.body;
    const role = await RoleDAL.createRole(data);
    res.status(200).json({
      status: "Success",
      data: role,
    });
  } catch (error) {
    throw error;
  }
};
