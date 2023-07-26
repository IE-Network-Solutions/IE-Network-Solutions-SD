const { getConnection } = require("typeorm");
const Notification = require("../../models/Notification");
const UserDAL = require("../users/dal");

class NotificationDAL {
    // Get All Notifications
    static async getAllNotifications() {
        try {
            // Form Connection
            const connection = getConnection();
            const notificationRepository = connection.getRepository(Notification);

            // Get Data
            const notes = await notificationRepository.find();
            return notes;
        } catch (error) {
            throw error;
        }
    }

    // Get All User Notifications
    static async getAllUserNotifications() {
        try {
            // Form Connection
            const connection = getConnection();
            const notificationRepository = connection.getRepository(Notification);

            // Get Data
            const notes = await notificationRepository.findBy({type: "User"});
            return notes;
        } catch (error) {
            throw error;
        }
    }

    // Get All System Notifications
    static async getAllSystemNotifications() {
        try {
            // Form Connection
            const connection = getConnection();
            const notificationRepository = connection.getRepository(Notification);

            // Get Data
            const notes = await notificationRepository.findBy({type: "System"});
            return notes;
        } catch (error) {
            throw error;
        }
    }

    // Get One Notification
    static async getOneNotification(data) {
        const id = data;
        try {
            // Form Connection
            const connection = getConnection();
            const notificationRepository = connection.getRepository(Notification);

            // Get Data
            const foundNotification = await notificationRepository.findBy({ id: id });
            return foundNotification;
        } catch (error) {
            throw error;
        }
    }

    // Create New Notification
    static async createNotification(data, isFromSystem, userID) {
        try {
            // Create Notification Object
            const notification = data;
            
            // Form Connection
            const connection = getConnection();
            const notificationRepository = connection.getRepository(Notification);

            // Create Notification
            const newNotification = await notificationRepository.create(notification);
            await notificationRepository.save(newNotification);
            return newNotification;
        } catch (error) {
            throw error;
        }
    }

    // Delete One Notification
    static async deleteNotification(id) {
        try {
            // Form Connection
            const connection = getConnection();
            const notificationRepository = connection.getRepository(Notification);

            // Delete Notification
            const deletedUser = await notificationRepository.delete({ id: id });

            return "Notification Deleted Successfully!";
        } catch (error) {
            throw error;
        }
    }

    // Delete All Notification
    static async deleteAllNotifications() {
        try {
            // Form Connection
            const connection = getConnection();
            const notificationRepository = connection.getRepository(Notification);

            // Get All Notification
            const allNotification = await notificationRepository.find();

            // Delete All Notification
            const deletedNotifications = await notificationRepository.delete(allNotification);
            return deletedNotifications;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = NotificationDAL;