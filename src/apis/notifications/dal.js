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
            const notes = await notificationRepository.find({ relations: ["created_by"] });
            console.log("user", notes)
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
            const notes = await notificationRepository.findBy({ type: "user" });
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
            const notes = await notificationRepository.findBy({ type: "system" });
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
            const foundNotification = await notificationRepository.findOne({ where: { id: id } });
            return foundNotification;
        } catch (error) {
            throw error;
        }
    }

    // Create New Notification
    static async createNotification(body) {

        try {
            // console.log(body.to, "ddgdgd")
            const connection = getConnection();
            const notificationRepository = connection.getRepository(Notification);
            const newNotification = notificationRepository.create({
                title: body.title,
                from: body.from,
                to: body.to,
                message: body.message,
                type: body.type,
                isRead: body.isRead,
                created_at: body.created_at,
                created_by: body.created_by
            });
            console.log(newNotification.to, "ddgdgdsl")
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
            return await notificationRepository.delete({ id: id });
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
    static async updateNotificationById(id, body) {
        const connection = getConnection();
        const notificationRepository = connection.getRepository(Notification);
        const notification = await notificationRepository.findOne({ where: { id: id } });
        const result = notificationRepository.merge(notification, body);
        return await notificationRepository.save(result);

    }

}

module.exports = NotificationDAL;