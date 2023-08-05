const { getConnection } = require("typeorm");
const Priority = require("../../models/Priority");

class PriorityDAL {
  // Get All Priorities
  static async getAllPriorities() {
    try {
      // Form Connection
      const connection = getConnection();
      const priorityRepository = connection.getRepository(Priority);

      // Get Data
      const priorities = await priorityRepository.find({
        where: { is_deleted: false },
      });
      return priorities;
    } catch (error) {
      throw error;
    }
  }

  // Get Priority of Ticket
  static async getPriority(data) {
    const id = data;
    try {
      // Form Connection
      const connection = getConnection();
      const priorityRepository = connection.getRepository(Priority);

      // Get Data
      const foundPriority = await priorityRepository.findOne({
        where: { id: id, is_deleted: false },
      });
      return foundPriority;
    } catch (error) {
      throw error;
    }
  }

  // Create New Priority
  static async createPriority(data) {
    try {
      // Create Priority Object
      const priority = data;

      // Form Connection
      const connection = getConnection();
      const priorityRepository = connection.getRepository(Priority);

      // Create Priority
      const newPriority = await priorityRepository.create(priority);
      await priorityRepository.save(newPriority);
      return newPriority;
    } catch (error) {
      throw error;
    }
  }

  // Edit Priority
  static async editPriority(id, data) {
    try {
      // Create Priority Objects
      const idPriority = id;
      const updatedFields = data;

      // Form Connection
      const connection = getConnection();
      const priorityRepository = connection.getRepository(Priority);

      const priority = await priorityRepository.findOneBy({ id: idPriority });

      // Update User
      // Update only the specified fields in the updatedFields object
      Object.keys(updatedFields).forEach((field) => {
        if (field in priority) {
          priority[field] = updatedFields[field];
        }
      });
      await priorityRepository.save(priority);

      return priority;
    } catch (error) {
      throw error;
    }
  }

  // Delete One Priority
  static async deletePriority(id) {
    try {
      // Form Connection
      const connection = getConnection();
      const priorityRepository = connection.getRepository(Priority);

      // Delete Priority
      const deletedPriority = await priorityRepository.delete({ id: id });

      return "Priority Deleted Successfully!";
    } catch (error) {
      throw error;
    }
  }

  // Delete All Priorities
  static async deleteAllPriorities() {
    try {
      // Form Connection
      const connection = getConnection();
      const priorityRepository = connection.getRepository(Priority);

      // Get All Priorities
      const allPriorities = await priorityRepository.find();

      // Delete All Priorities
      const deletedPriorities = await priorityRepository.delete(allPriorities);
      return deletedPriorities;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PriorityDAL;
