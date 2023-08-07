const { getConnection } = require("typeorm");
const User = require("../../models/User");

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
        relations: ["department", "manager", "role.permissions", "permissions"],
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
        ],
        relations: ["department", "manager", "role.permissions", "permissions"],
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
        department,
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

      if (department) {
        newUser.department = department;
      }
      await userRepository.save(newUser);

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
        relations: ["role", "permissions"],
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
}

module.exports = UserDAL;
