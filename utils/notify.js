const { getConnection } = require("typeorm");
const Notification = require("../../models/Notification");

const notify = async (data) => {
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


module.exports = notify;