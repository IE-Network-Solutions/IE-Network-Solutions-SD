const AppError = require("../../../utils/apperror");
const UserDAL = require("./dal");

exports.introduction = async (req, res, next) => {
    // Respond
    res.status(200).json({
        status: "Success",
        data: {},
    });
}

exports.getAllUsers = async (req, res, next) => {
    // Get All Users
    let users = await UserDAL.getAllUsers();

    // Respond
    res.status(200).json({
        status: "Success",
        data: users,
    });
}

exports.getOneUser = async (req, res, next) => {
    // Get ID
    let id = req.params.id;
    let user = await UserDAL.getOneUser(id);

    // Respond
    res.status(200).json({
        status: "Success",
        data: user,
    });
}


exports.createUser = async (req, res, next) => {
    // Get Req Body
    let user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role: req.body.role,
        department: req.body.department,
        user_type: req.body.user_type,
    }

    // Check Required Fields
    if (!user.first_name || !user.last_name || !user.email || !user.role || !user.department || !user.user_type) {
        return next(new AppError("Please fill all required fields", 400));
    }

    // Check For Duplication
    // let userExist = await UserDAL.getOneUser(user);
    // console.log(userExist);
    // console.log(userExist == true);
    // if(userExist ==  true || userExist == "true") {
    //     return next(new AppError("User Already Exists!", 400));
    // }

    // Create New User
    let newUser = await UserDAL.createUser(user);

    // Respond
    res.status(200).json({
        status: "Success",
        data: newUser,
    });
}

exports.deleteUser = async (req, res, next) => {
    // Get Req Body
    let user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role: req.body.role,
        department: req.body.department,
        user_type: req.body.user_type,
    }

    // Check Required Fields
    if (!user.first_name || !user.last_name || !user.email || !user.role || !user.department || !user.user_type) {
        return next(new AppError("Please fill all required fields", 400));
    }

    // Delete User
    let deletedUser = await UserDAL.deleteUser(user);

    // Respond
    res.status(200).json({
        status: "Success",
        data: deletedUser,
    });
}

exports.deleteAllUsers = async (req, res, next) => {
    // Delete All Users
    let deletedUsers = await UserDAL.deleteAllUsers();

    // Respond
    res.status(200).json({
        status: "Success",
        data: deletedUsers,
    });
}

exports.editUser = async (req, res, next) => {
    // Get Req Body
    let id = req.body.id;
    let user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        role: req.body.role,
        department: req.body.department,
        user_type: req.body.user_type,
    }

    // Check Required Fields
    if (!user.first_name || !user.last_name || !user.email || !user.role || !user.department || !user.user_type) {
        return next(new AppError("Please fill all required fields", 400));
    }

    // Edit User
    let editedUser = await UserDAL.editUser(id, user);

    // Respond
    res.status(200).json({
        status: "Success",
        data: editedUser,
    });
}

exports.loginUser = async (req, res, next) => {}

exports.logoutUser = async (req, res, next) => {}

