const { getConnection } = require("typeorm");
const Status = require("../../models/Status");

class StatusDAL {
    // Get All Statuses
    static async getAllStatuses() {
        try {
            // Form Connection
            const connection = getConnection();
            const statusRepository = connection.getRepository(Status);

            // Get Data
            const statuses = await statusRepository.find();
            return statuses;
        } catch (error) {
            throw error;
        }
    }

    // Get Status of Ticket
    static async getStatus(data) {
        const id = data;
        try {
            // Form Connection
            const connection = getConnection();
            const statusRepository = connection.getRepository(Status);

            // Get Data
            const foundStatus = await statusRepository.findBy({ id: id });
            return foundStatus;
        } catch (error) {
            throw error;
        }
    }

    // Create New Status
    static async createStatus(data) {
        try {
            // Create Priority Object
            const status = data;

            // Form Connection
            const connection = getConnection();
            const statusRepository = connection.getRepository(Status);

            // Create Status
            const newStatus = await statusRepository.create(status);
            await statusRepository.save(newStatus);
            return newStatus; 
        } catch (error) {
            throw error;
        }
    }

    // Edit Status
    static async editStatus(id, data) {
        try {
            // Create Status Objects
            const idStatus = id;
            const updatedFields = data;

            // Form Connection
            const connection = getConnection();
            const statusRepository = connection.getRepository(Status);

            const status = await statusRepository.findOneBy({ id: idStatus });

            // Update User
            // Update only the specified fields in the updatedFields object
            Object.keys(updatedFields).forEach((field) => {
                if (field in status) {
                    status[field] = updatedFields[field];
                }
            });
            await statusRepository.save(status);

            return status;
        } catch (error) {
            throw error;
        }
    }

    // Delete One Status
    static async deleteStatus(id) {
        try {
            // Form Connection
            const connection = getConnection();
            const statusRepository = connection.getRepository(Status);

            // Delete Priority
            const deletedStatus = await statusRepository.delete({ id: id });

            return "Priority Deleted Successfully!";
        } catch (error) {
            throw error;
        }
    }

    // Delete All Statuses
    static async deleteAllStatuses() {
        try {
            // Form Connection
            const connection = getConnection();
            const statusRepository = connection.getRepository(Status);

            // Get All Statuses
            const allStatuses = await statusRepository.find();

            // Delete All Statuses
            const deletedStatuses = await statusRepository.delete(allStatuses);
            return deletedStatuses;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = StatusDAL;