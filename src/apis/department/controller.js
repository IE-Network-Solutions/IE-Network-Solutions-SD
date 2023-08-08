const DepartmentDAL = require("./dal");
const AppError = require("../../../utils/apperror");
const UserDAL = require("../users/dal");

exports.introduction = async (req, res, next) => {
  // Respond
  res.status(200).json({
    status: "Success",
    data: {},
  });
};

exports.getAllDepartments = async (req, res, next) => {
  try {
    // Get All Departments
    let departments = await DepartmentDAL.getAllDepartments();

    // Respond
    res.status(200).json({
      status: "Success",
      data: departments,
    });
  } catch (error) {
    throw error;
  }
};

exports.getDepartment = async (req, res, next) => {
  // Get ID
  let id = req.params.id;
  let department = await DepartmentDAL.getDepartment(id);

  // Return If Department Doesn't Exist
  if (!department) return next(new AppError("Department Does Not Exist!", 404));

  // Respond
  res.status(200).json({
    status: "Success",
    data: department,
  });
};

exports.createDepartment = async (req, res, next) => {
  try {
    // Get Req Body
    let department = req.body;
    let department_lead = await UserDAL.getOneUser(department.team_lead);

    //   chek if user exist or not
    if (!department_lead) {
      return next(new AppError("the team lead you choose does not exist"));
    }
    department.department_lead = department_lead;

    // Create department
    let newDepartment = await DepartmentDAL.createDepartment(department);

    // Respond
    res.status(200).json({
      status: "Success",
      data: newDepartment,
    });
  } catch (error) {
    throw error;
  }
};

exports.editDepartment = async (req, res, next) => {
  try {
    // Get Req Body
    let id = req.body.id;
    let department = req.body;

    // Check If Department Exists
    let checkDepartment = DepartmentDAL.getDepartment(id);
    if (!checkDepartment) {
      return next(new AppError("Department Doesn't Exist!", 404));
    }

    // Edit Department
    let editedDepartment = await DepartmentDAL.editDepartment(id, department);

    // Respond
    res.status(200).json({
      status: "Success",
      data: editedDepartment,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    // Get Req Body
    const id = req.params.id;

    // Check If Department Exists
    const department = await DepartmentDAL.getDepartment(id);
    if (!department) return next(new AppError("Department Does Not Exist!"));

    // Delete Department
    const deletedDepartment = await DepartmentDAL.deleteDepartment(id);

    // Respond
    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteAllDepartments = async (req, res, next) => {
  try {
    // Delete All Departments
    let deletedDepartments = await DepartmentDAL.deleteAllDepartments();

    // Respond
    res.status(200).json({
      status: "Success",
      data: deletedDepartments,
    });
  } catch (error) {
    throw error;
  }
};
