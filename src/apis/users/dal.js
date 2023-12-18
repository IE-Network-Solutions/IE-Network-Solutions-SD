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
const config = require("../../../utils/configs");
const { sendEmailNotification } = require("../../../utils/sendNotification");
const teamDAL = require("../team/dal");

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
        select: ["id", "first_name", "last_name", "email", "user_type", "profile_pic", "phone_number"],
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
  static async getUserTeam(id) {
    const connecition = getConnection();
    const teamUserRepository = await connecition.getRepository(TeamUser);
    return await teamUserRepository.find({ where: { user_id: id }, relations: ['team'] })
  }
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
          "tokenExpirationTime",
          "profile_pic",
          "created_by",
          "phone_number"
        ],
        relations: ["manager", "role.permissions", "permissions", "created_by", "teams_access"],
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
        teams,
        phone_number,
        profile_pic,
        manager_id,
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
        phone_number,
        manager_id: manager_id,
        profile_pic: profile_pic,
      });

      if (role) {
        newUser.role = role;
      }

      if (teams) {
        newUser.teams = teams;
      }
      await userRepository.save(newUser);

      if (teams) {
        await this.teamAccess(newUser?.id, teams);
      }

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  static async editUser(id, data) {
    try {
      const idUser = id;
      const updatedFields = data;
      const connection = getConnection();
      const userRepository = connection.getRepository(User);
      const user = await userRepository.findOne({ where: { id: idUser } });
      if (!user) {
        throw new Error('User not found');
      }
      await userRepository.update(id, {
        first_name: updatedFields?.first_name,
        last_name: updatedFields?.last_name,
        phone_number: updatedFields?.phone_number,
        user_type: updatedFields?.user_type,
        profile_pic: updatedFields?.profile_pic,
      });
      console.log("user profile picture", updatedFields)

      const userTeamRepository = connection.getRepository(TeamUser);
      await userTeamRepository.delete({ user_id: id });

      if (updatedFields.team_id) {
        const teams = updatedFields.team_id;
        const teamEntities = teams.map((teamId) => ({
          user_id: id,
          team_id: teamId,
        }));
        await userTeamRepository.save(teamEntities);
      }
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
        relations: ["role.permissions", "permissions", "teams_access", "managed_teams"],
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
    console.log("list of teams", userId)


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
      config.email.systemEmail,
      email,
      "[IE Networks Solutions] Password Reset E-mail",
      `<h2>Hello ${user.first_name} ${user.last_name}, ${type == "client" ? "[Client]" : "[Employee]"}</h2>
      <p> You're receiving this e-mail because you or someone else has requested a password reset for your user account.</p>
      <h4>Click the link below to reset your password:</h4>
    <a href="http://172.16.32.114:5173/verification/${user.id}">Click here to change your default password</a>
    <p> Your verification code is <strong>  ${user.verificationCode}</strong></p>
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

  static async getAllAdminsByRole(roleName) {
    const connection = getConnection();
    const userRepository = await connection.getRepository(User);
    return await userRepository.find({ where: { role: roleName } })
  }
}

module.exports = UserDAL;
