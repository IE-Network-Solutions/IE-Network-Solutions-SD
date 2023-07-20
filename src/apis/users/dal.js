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
            const users = await userRepository.find();
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
            const connection = getConnection();
            const userRepository = connection.getRepository(User);

            // Get Data
            const foundUser = await userRepository.findBy({"id": id});
            return foundUser;

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
            const user = data;

            // Form Connection
            const connection = getConnection();
            const userRepository = connection.getRepository(User);
      
            // Create User
            const newUser = await userRepository.create(user);
            await userRepository.save(newUser);

            return newUser;      
        } catch(error) {
            throw error;
        }
    }

    // Edit User
    static async editUser(id, data) {
        try {
            // Create User Objects
            const idUser = id;
            const user = data;

            // Form Connection
            const connection = getConnection();
            const userRepository = connection.getRepository(User);
      
            // Update User
            const editedUser = await userRepository.update({
                id: idUser,
            }, user);
            // await userRepository.save(editedUser);

            return editedUser;  
        } catch(error) {
            throw error;
        }
    }

    // Delete User
    static async deleteUser(data) {
        try {
            // Create User Object
            const user = data;

            // Form Connection
            const connection = getConnection();
            const userRepository = connection.getRepository(User);
        
            // Delete User
            const deletedUser = await userRepository.delete(user);

            return deletedUser;      
        } catch(error) {
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
    
}


module.exports = UserDAL;
