const AppError = require("../../../utils/apperror");
const UserDAL = require("./dal");
const RoleDAL = require("../role/dal");
const DepartmentDAL = require("../department/dal");
const hash = require("../../../utils/hashpassword");
const generateRandomPassword = require("../../../utils/generateRandomPassword");
const checkHash = require("../../../utils/comparePassword");
const createToken = require("../../../utils/generateToken");
const sendEmail = require("../../../utils/sendEmail");
const authToken = require("../../middlewares/auth/authToken");
const teamDAL = require("../team/dal");
const validateUuid = require("uuid-validate");
const jwt = require("jsonwebtoken");
const { checkVerificationCode } = require("../../../utils/checkVerificationCode");
const { generateVerificationCode, getFormattedTime } = require("../../../utils/generateVerificationCode");

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
    const id = req.params.id;
    const user = await UserDAL.getOneUser(id);

    //   return if user does not exist
    if (!user) return next(new AppError("user does not exist", 404));

    // Respond
    res.status(200).json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    console.log(error);
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
    user.password = hash(generateRandomPassword(8, true, true, true));
    user.user_id = req?.user?.id;
    console.log("user id", user)
    // user.password = hash("%TGBnhy6");

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
    if (user.team_id) {
      const team = await teamDAL.getTeam(user.team_id);
      if (!team) return next(new AppError("team does not exist"));
      user.team = team;
    }

    // Create New User
    let newUser = await UserDAL.createUser(user);
    await UserDAL.sendChangePasswordAlertByEmail("employee", req.body.email);
    // Respond
    res.status(200).json({
      status: "Success",
      data: newUser,
    });
  } catch (error) {
    return next(new AppError(error));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // Get Req Body
    const id = req.params.id;
    const deletedUser = await UserDAL.deleteUser(id);
    if (deletedUser.affected === 0) {
      return next(new AppError("User is not Deleted"));
    }
    // Respond
    res.status(200).json({
      status: "Success",
      message: "User is successfully deleted",
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Server Error", 500));
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
    console.log("id");
    let id = req.params.id;
    console.log("id");
    let user = req.body;

    //   check if user exist or not
    let chekUser = await UserDAL.getOneUser(id);
    if (!chekUser) {
      return next(new AppError("user does not exist", 404));
    }

    if (user.role_id) {
      const role = await RoleDAL.getRoleById(user.role_id);
      user.role = role;
    }

    // check if profilr update
    if (req.file) {
      user.profile_pic = req.file.path;
    }

    // Edit User
    let editedUser = await UserDAL.editUser(id, user);

    // Respond
    res.status(200).json({
      status: "Success",
      data: editedUser,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.editPassword = async (req, res, next) => {
  try {
    // Get Req Body
    console.log("id");
    let id = req.params.id;
    console.log("id");
    let user = req.body;

    //   check if user exist or not
    let chekUser = await UserDAL.getOneUser(id);
    console.log(chekUser.password);
    if (!chekUser) {
      return next(new AppError("user does not exist", 404));
    }
    // validate user credential
    if (!checkHash(user.old_password, chekUser.password))
      return next(new AppError("please check your old credential"));

    user.password = hash(user.password);
    user.password_changed = true;

    // check if profilr update
    if (req.file) {
      user.profile_pic = req.file.path;
    }

    // Edit User
    let editedUser = await UserDAL.editUser(id, user);

    // Respond
    res.status(200).json({
      status: "Success",
      data: editedUser,
    });
  } catch (error) {
    console.log(error);
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
    if (!checkHash(password, user.password))
      return next(new AppError("please check your credential"));

    return await res.status(200).json({
      Status: "Success",
      data: { user: user },
    });
  }
  // validate user credential
  if (!checkHash(password, user.password))
    return next(new AppError("please check your credential"));

  // Sign JWT
  let token = await createToken({ id: user.id });
  res.cookie("token", token, { httpOnly: true });

  // filter password
  const filteredData = {};
  for (const key in user) {
    if (key !== "password") {
      filteredData[key] = user[key];
    }
  }
  await UserDAL.storeToken({ userId: user.id, token: token, isRevoked: false })

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

exports.logout = async (req, res, next) => {
  const currentLoggedInUserToken = await UserDAL.logout(req.user.id);
  // const user = await UserDAL.getOneUser(currentLoggedInUserToken.userId)
  console.log(currentLoggedInUserToken)
  if (!req.user.id) {
    return next(new AppError("There is Error", 400))
  }
  res.status(200).json({
    status: "success",
    message: "User is successfully logout",
    statusCode: 200,
    // data: user
  });
};

exports.teamAccess = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const teamIds = req.body.teams;

    //   validate uuid
    teamIds.map((uuid) => {
      if (!validateUuid(uuid)) {
        return next(new AppError("Invalid team Id", 500));
      }
    });

    // check teams
    const teams = await teamDAL.findMultipleTeams(teamIds);
    if (!teams)
      return next(new AppError("team from the input does not exist", 404));

    // check user
    const user = await UserDAL.getOneUser(userId);
    if (!user) return next("user does not exist", 404);

    // assign team for the user
    const teamUser = await UserDAL.teamAccess(userId, teamIds);

    res.status(200).json({
      status: "Success",
      data: teamUser,
    });
  } catch (error) {
    throw error;
  }
};

exports.sendChangePasswordAlertByEmail = async (req, res, next) => {
  const user = await UserDAL.sendChangePasswordAlertByEmail(req.user.email, req.user.email);
  if (!user) {
    return next(new AppError("User not Found with the email you provided"));
  }

  res.status(200).json({
    status: "Success",
    data: user
  });
}
exports.checkVerificationCode = async (req, res, next) => {
  const { code } = req.body;
  const user = await UserDAL.getOneUser(req.params.id);
  if (!await checkVerificationCode(user.verificationCode, code)) {
    return next(new AppError("Incorrect verification code", 400));
  }

  if (Date.now() > user.tokenExpirationTime) {
    await UserDAL.sendChangePasswordAlertByEmail("client", user.email)
    await sendEmail(
      user.email,
      user?.created_by?.email,
      "Verification code",
      "The verification code expired, please activate my verification code to reset my default passoward",
      "cc"
    )
    return next(new AppError("The verification code is Expired", 400));
  }

  return res.status(200).json(
    {
      status: "Success",
      data: code

    })
}
exports.sendChangePasswordRequest = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    // const decodedToken = jwt.verify(req.params.id, process.env.JWT_SECRET);
    const user = await UserDAL.getOneUser(req.params.id);

    if (!user) {
      return next(new AppError("User Not Found.", "404"))
    }
    // if (newPassword != confirmPassword) {
    //   return next(new AppError("Password and confirmation do not match.", "400"))
    // }

    await UserDAL.sendChangePasswordRequest(req.params.id, req.body);
    const result = await UserDAL.getOneUser(req.params.id);
    if (!result) {
      return next(new AppError("User not found"));
    }

    res.status(200).json({
      status: "Success",
      data: result
    });
  }
  catch (error) {
    if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
      return res.status(401).json({ error: 'Invalid token signature' });
    }
  }

}

