const AppError = require("../../../utils/apperror");
const UserDAL = require("./dal");
const RoleDAL = require("../role/dal");
const DepartmentDAL = require("../department/dal");
const jwt = require("../../middlewares/auth");
const hash = require("../../../utils/hashpassword");
const generateRandomPassword = require("../../../utils/generateRandomPassword");
const checkHash = require("../../../utils/comparePassword");
const createToken = require("../../../utils/generateToken");
const sendEmail = require("../../../utils/sendEmail");

exports.introduction = async (req, res, next) => {
  // Respond
  res.status(200).json({
    status: "Success",
    data: {},
  });
};

exports.getAllUsers = async (req, res, next) => {
  try {
    // Get All Users
    let users = await UserDAL.getAllUsers();

    // Respond
    res.status(200).json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    throw error;
  }
};

exports.getOneUser = async (req, res, next) => {
  try {
    // Get ID
    let id = req.params.id;
    let user = await UserDAL.getOneUser(id);

    //   return if user does not exist
    if (!user) return next(new AppError("user does not exist", 404));

    // Respond
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    throw error;
  }
};
exports.getLoggedUserData = async (req, res, next) => {
  try {
    // Get ID
    // let id = req.params.id;
    let user = req.user;

    //   return if user does not exist
    if (!user) return next(new AppError("user does not exist", 404));

    // Respond
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (req, res, next) => {
  try {
    // Get Req Body
    let user = req.body;
    const user_profile = req.file ? req.file.path : null;
    user.profile_pic = user_profile;
    user.password = hash("%TGBnhy6");

    // check if email exsist or not
    const checkUser = await UserDAL.getUserByEmail(user.email);
    if (checkUser) {
      return next(new AppError("user with the given email already exist"));
    }

    // check if role exist
    if (user.role_id) {
      const role = await RoleDAL.findOneRoleById(user.role_id);
      if (!role) return next(new AppError("role does not exist"));
      user.role = role;
    }

    // check if department exist
    if (user.department_id) {
      const department = await DepartmentDAL.getDepartment(user.department_id);
      if (!department) return next(new AppError("department does not exist"));
      user.department = department;
    }

    // Create New User
    let newUser = await UserDAL.createUser(user);

    // Respond
    res.status(200).json({
      status: "Success",
      data: newUser,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // Get Req Body
    const id = req.params.id;

    const user = await UserDAL.getOneUser(id);
    if (!user) return next(new AppError("user does not exist"));
    // Delete User
    const deletedUser = await UserDAL.deleteUser(id);

    // Respond
    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteAllUsers = async (req, res, next) => {
  try {
    // Delete All Users
    let deletedUsers = await UserDAL.deleteAllUsers();

    // Respond
    res.status(200).json({
      status: "Success",
      data: deletedUsers,
    });
  } catch (error) {
    throw error;
  }
};

exports.editUser = async (req, res, next) => {
  try {
    // Get Req Body
    let id = req.body.id;
    let user = req.body;

    //   check if user exist or not
    let chekUser = UserDAL.getOneUser(id);
    if (!chekUser) {
      return next(new AppError("user does not exist", 404));
    }

    // Edit User
    let editedUser = await UserDAL.editUser(id, user);

    // Respond
    res.status(200).json({
      status: "Success",
      data: editedUser,
    });
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (req, res, next) => {
  // Get Req Body
  let { email, password } = req.body;

  // Check User Existence by email
  let user = await UserDAL.getUserByEmail(email);

  if (!user) return next(new AppError("User Not Found!", 404));

  if (user.password_changed == false) {
    return next(new AppError("please change your password"));
  }
  // validate user credential
  if (!checkHash(password, user.password))
    return next(new AppError("please check your credential"));

  // Sign JWT
  let token = await createToken({ id: user.id });

  // filter password
  const filteredData = {};
  for (const key in user) {
    if (key !== "password") {
      filteredData[key] = user[key];
    }
  }
  console.log(filteredData);
  // Respond
  res.status(200).json({
    status: "Success",
    data: {
      user: filteredData,
      token: token,
    },
  });
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Get Req Body
    let email = req.body.email;

    // Generate Password
    let password = hash("%TGBnhy6");

    // Check User Existence
    let user = await UserDAL.getUserByEmail(email);
    if (!user) return next(new AppError("User Not Found!", 404));

    // Reset Password
    user.password = password;
    let passwordResetUser = await UserDAL.editUser(user.id, user);

    // Respond
    res.status(200).json({
      status: "Success",
      data: passwordResetUser,
    });
  } catch (error) {
    throw error;
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // Get Req Body
    let email = req.body.email;

    // Generate Password
    let newPassword = hash(generateRandomPassword());

    // Check User Existence
    let user = await UserDAL.getUserByEmail(email);
    if (!user) return next(new AppError("User Not Found!", 404));

    // Reset Password
    user.password = newPassword;
    let passwordChangedUser = await UserDAL.editUser(user.id, user);

    // Email New Password To User
    let newPass = "Your new password is: " + newPassword;
    await sendEmail(
      process.env.SYSTEM_EMAIL,
      email,
      "Forgot Password",
      newPass
    );

    // Respond
    res.status(200).json({
      status: "Success",
      data: passwordChangedUser,
    });
  } catch (error) {
    throw error;
  }
};
