const { getConnection } = require("typeorm");
const catagories = require("../../models/Catagoreis");

class catagoryDAL {

  // This method implements to get all catagories
  static async getAllCatagories() {
    try {
      // Create connections
      const connection = getConnection();

      // Inject catagory model
      const catagoyRepository = connection.getRepository(catagories);

      //Returns all catagory values
      return await catagoyRepository.find({ relations: ["knowledgebase.createdBy"] });

    } catch (error) {
      throw error;
    }
  }

  static async getCatagoryById(id) {
    try {
      // Create connection
      const connection = await getConnection();

      //Inject catagories model
      const catagoryRepository = connection.getRepository(catagories);

      return await catagoryRepository.findOne({ where: { id: id }, relations: ["knowledgebase.createdBy"] });

    } catch (error) {
      throw error;
    }
  }

  //This method implements to create new catagories
  static async createCatagory(data) {
    try {
      const { name, description } = data;

      // Create connection
      const connection = getConnection();

      //Inject catagory model
      const catagoryRepository = connection.getRepository(catagories);

      const catagory = await catagoryRepository.create({ name, description });

      return await catagoryRepository.save(catagory);

    } catch (error) {
      if (error.code === '23503') {
        return { Message: "Foreign key Constraint FAIL please insert correct id" };
      }
    }
  }

  //This method implements to update catagory by id
  static async updateCatagory(id, updatedFields) {
    try {
      //Create a connections
      const connection = getConnection();

      //Inject catagory model
      const catagoryRepository = connection.getRepository(catagories);

      // fetch the catagory to be updated
      const catagory = await catagoryRepository.findOneBy({ id: id });

      catagoryRepository.merge(catagory, updatedFields);

      return await catagoryRepository.save(catagory);

    } catch (error) {
      if (error.code === '23503') {
        return { Message: "Foreign key Constraint FAIL please insert correct id" };
      }
    }
  }

  //This method implements to delete catagory by id
  static async deleteCatagory(id) {
    try {
      // Create connection
      const connection = getConnection();

      //Inject catagory model
      const catagoryRepository = connection.getRepository(catagories);

      return await catagoryRepository.delete({ id });

    } catch (error) {
      throw error;
    }
  }
}

module.exports = catagoryDAL;
