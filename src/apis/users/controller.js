const AppError = require("../../../utils/apperror");
const UserDAL = require("./dal");
const jwt = require("../../middlewares/auth");
const hash = require("../../../utils/hashpassword");
const checkHash = require("../../../utils/comparePassword");
const createToken = require("../../../utils/generateToken");

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

exports.createUser = async (req, res, next) => {
  try {
    // Get Req Body
    let user = req.body;
    user.password = hash("%TGBnhy6");

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
    let user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      role: req.body.role,
      department: req.body.department,
      user_type: req.body.user_type,
    };

    // Delete User
    let deletedUser = await UserDAL.deleteUser(user);

    // Respond
    res.status(200).json({
      status: "Success",
      data: deletedUser,
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

  // validate user credential
  if (!checkHash(password, user.password))
    return next(new AppError("please check your credential"));

  // Sign JWT
  let token = await createToken({ id: user.id });

  // Respond
  res.status(200).json({
    status: "Success",
    data: {
      user: user,
      token: token,
    },
  });
};

exports.logoutUser = async (req, res, next) => {};
