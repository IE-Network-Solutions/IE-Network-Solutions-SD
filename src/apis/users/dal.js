const { getConnection } = require("typeorm");
const User = require("../../models/User");
const TeamUser = require("../../models/TeamUser");
const Team = require("../../models/Team");
const Token = require("../../models/Token");
const sendEmail = require("../../../utils/sendEmail");
const createToken = require("../../../utils/generateToken");
const { verifyToken } = require("../../middlewares/auth");
const hash = require("../../../utils/hashpassword");
const { generateVerificationCode } = require("../../../utils/generateVerificationCode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateRandomPassword = require("../../../utils/generateRandomPassword");

class UserDAL {
  // Get All Users
  static async getAllUsers() {
    try {
      // Form Connection
      const connection = getConnection();
      const userRepository = connection.getRepository(User);

      // Get Data
      const users = await userRepository.find({
        where: { user_type: "employee", is_deleted: false },
        select: ["id", "first_name", "last_name", "email", "user_type"],
        relations: [
          "team",
          "manager",
          "role.permissions",
          "permissions",
          "teams_access",
        ],
      });
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Get One User
  static async getOneUser(data) {
    const id = data;
    try {
      // Form Connection
      const connection = await getConnection();
      const userRepository = await connection.getRepository(User);

      // Get Data
      const foundUser = await userRepository.findOne({
        where: { id: id, is_deleted: false },
        select: [
          "id",
          "email",
          "first_name",
          "last_name",
          "user_type",
          "password",
          "verificationCode",
          "profile_pic"
        ],
        relations: ["team", "manager", "role.permissions", "permissions"],
      });
      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  // get all admins
  static async getAllAdmins() {
    try {
      const roleName = "Admin";
      // get connection from the pool
      const connection = getConnection();

      // create bridge to the db
      const userRepository = connection.getRepository(User);

      // get all users where role Admin
      const admins = userRepository
        .createQueryBuilder("user")
        .leftJoin("user.role", "role")
        .select(["user.email"])
        .select(["user.id"])
        .where("role.roleName = :roleName", { roleName })
        .getMany();

      return admins;
    } catch (error) {
      throw error;
    }
  }

  // Get User by User Data
  static async getUserByUserData(data) {
    const userData = data;
    try {
      // Form Connection
      const connection = getConnection();
      const userRepository = connection.getRepository(User);

      // Get Data
      const foundUser = await userRepository.findOneBy(userData);
      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  // Create User
  static async createUser(data) {
    try {
      // Create User Object
      const {
        first_name,
        last_name,
        email,
        password,
        role,
        team,
        manager_id,
        profile_pic,
      } = data;
      const user_type = "employee";

      // Form Connection
      const connection = getConnection();
      const userRepository = connection.getRepository(User);

      // Create User
      const newUser = await userRepository.create({
        first_name,
        last_name,
        email,
        password,
        user_type,
        manager_id: manager_id,
        profile_pic,
      });

      if (role) {
        newUser.role = role;
      }

      if (team) {
        newUser.team = team;
      }
      await userRepository.save(newUser);

      if (team) {
        await this.teamAccess(newUser.id, [team.id]);
      }

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  // Edit User
  static async editUser(id, data) {
    try {
      // Create User Objects
      const idUser = id;
      const updatedFields = data;

      // Form Connection
      const connection = getConnection();
      const userRepository = connection.getRepository(User);

      const user = await userRepository.findOne({ where: { id: idUser } });
      // Update User
      // Update only the specified fields in the updatedFields object
      userRepository.merge(user, updatedFields);

      await userRepository.save(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Delete User
  static async deleteUser(id) {
    try {
      // Form Connection
      const connection = await getConnection();
      const userRepository = await connection.getRepository(User);
      const user = await userRepository.find({
        where: { id: id },
        relations: ["permissions"],
      });
      if (!user) {
        return;
      }
      return await userRepository.remove(user);
    } catch (error) {
      throw error;
    }
  }

  // Delete All Users
  static async deleteAllUsers() {
    try {
      // Form Connection
      const connection = getConnection();
      const userRepository = connection.getRepository(User);

      // Get All Users
      const allUsers = await userRepository.find();

      // Delete All Users
      const deletedUsers = await userRepository.delete(allUsers);
      return deletedUsers;
    } catch (error) {
      throw error;
    }
  }

  // get user by email
  static async getUserByEmail(email) {
    try {
      // Form Connection
      const connection = getConnection();
      const userRepository = connection.getRepository(User);

      // get user by email
      const user = userRepository.findOne({
        where: { email: email },
        relations: ["role", "permissions", "teams_access", "managed_teams"],
      });

      // return user
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async findMultipleUsers(userIds) {
    try {
      // get connection
      const connection = getConnection();
      // get users
      const userRepository = connection.getRepository(User);
      const users = await userRepository.findByIds(userIds);

      // return users
      return users;
    } catch (error) {
      throw error;
    }
  }

  static async deletePermissionForSpecificUser(userId, permissionId) {
    try {
      const connecition = await getConnection();
      const userRepository = await connecition.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["permissions"],
      });
      if (!user) {
        return;
      }
      user.permissions = user.permissions.filter(
        (permission) => permission.id !== permissionId
      );
      return await userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  static async teamAccess(userId, teamIds) {
    // create connection
    const connection = getConnection();

    // create bridge to user db
    const userRepository = connection.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId } });

    // create bridge to team db
    const teamRepository = connection.getRepository(Team);
    const teams = await teamRepository.findByIds(teamIds);

    // create bridge to team user db
    const teamUserRepository = connection.getRepository(TeamUser);
    const teamUsers = teams.map((team) => {
      const teamUser = teamUserRepository.create({
        user: user,
        team,
      });
      return teamUser;
    });

    await teamUserRepository.save(teamUsers);

    return teamUsers;
  }

  static async storeToken(tokenBody) {
    const connection = getConnection();
    const tokenRepository = await connection.getRepository(Token);
    const result = tokenRepository.create({
      userId: tokenBody.userId,
      token: tokenBody.token,
      isRevoked: tokenBody.isRevoked
    })
    return await tokenRepository.save(result);
  }

  static async logout(userId) {
    const connection = getConnection();
    const tokenRepository = await connection.getRepository(Token);
    const result = await tokenRepository.findOne({ where: { userId: userId } });
    if (!result) {
      return;
    }
    await tokenRepository.update(result.id, { isRevoked: true });
    return result;
  }

  static async sendChangePasswordAlertByEmail(type, email) {
    const connection = await getConnection();
    const userRepository = connection.getRepository(User);
    const user = await this.getUserByEmail(email);
    const resetToken = await jwt.sign(user.id, process.env.JWT_SECRET);

    user.verificationCode = (await generateVerificationCode()).code;
    user.passwordChangeToken = resetToken;
    user.tokenExpirationTime = (await generateVerificationCode()).expiresAt;

    const result = await userRepository.create(user);
    await userRepository.save(result);
    await sendEmail(
      process.env.SYSTEM_EMAIL,
      email,
      "[IE Networks Solutions] Password Reset E-mail",
      `<h2>Hello ${user.first_name} ${user.last_name}, ${type == "client" ? "[Client]" : "[Employee]"}</h2>
      <p> You're receiving this e-mail because you or someone else has requested a password reset for your user account.</p>
      <h4>Click the link below to reset your password:</h4>
    <a href="http://172.16.32.114:5173/verification/${user.id}">Click here to change your default password</a>
    <p> Your verification code is <strong> ${user.verificationCode}</strong></p>
       <p>Verification Code will expire at:<strong> ${(await generateVerificationCode()).expiresAt.toString()}</strong></p>
       <p>This is your new password :<strong> ${(await generateRandomPassword(8, true, true, true, true))}</strong></p>
       <p>If you did not request a password reset you can safely ignore this email.</p?
    <p>Thank you!</p>`,
      "Chage password"
    );
    return user;
  }

  static async sendChangePasswordRequest(id, body) {
    const connecition = getConnection();
    const userRepository = await connecition.getRepository(User);
    const newPassword = await bcrypt.hash(body.newPassword, 10);
    return await userRepository.update(
      {
        id: id
      },
      {
        password: newPassword,
        passwordChangeToken: null,
        verificationCode: null,
        password_changed: true
      }
    );
  }
}

module.exports = UserDAL;
