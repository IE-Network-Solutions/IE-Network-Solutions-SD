const { getConnection } = require("typeorm");
const catagories = require("../../models/Catagoreis");
const { validate: isUUID } = require("uuid");

class catagoryDAL {
    // This method implements to get all catagories
  static async getAllCatagories() {
    try 
    {
    // Create connections
      const connection = await getConnection();

    // Inject catagory model
      const catagoyRepository = connection.getRepository(catagories);
    
      //Returns all catagory values
      return await catagoyRepository.find();
      
    } catch (error) {
      throw error;
    }
  }

  static async getCatagoryById(id) {
    try {
      // check the validity of the id format.
      if (!isUUID(id)) {
        return null;
      }

      // form connection
      const connection = await getConnection();
      const catagoryRepository = connection.getRepository(catagories);

      // fetch data.
      return await catagoryRepository.findOneBy({ id: id });
    } catch (error) {
      throw error;
    }
  }

  static async createCatagory(data) {
    try {
      const {name, description, knowledgeBase_id } = data;

      // const id =
      const connection = getConnection();

      const catagoryRepository = connection.getRepository(catagories);

      const catagory = await catagoryRepository.create({
        name,
        description,
        knowledgeBase_id
      });

      return await catagoryRepository.save(catagory);
    } catch (error) {
      throw error;
    }
  }

  static async updateCatagory(id, updatedFields) {
    // check the validity of the id format.
    if (!isUUID(id)) {
      return null;
    }

    // form connection
    const connection = getConnection();
    const catagoryRepository = connection.getRepository(catagories);

    // fetch the catagory to be updated
    const catagory = await catagoryRepository.findOneBy({ id: id });

    // update
    catagoryRepository.merge(catagory, updatedFields);
    await catagoryRepository.save(catagory);

    // return updated catagory data.
    return catagories;
  }

  static async deleteCatagory(id) {
    // check the validity of the id format.
    if (!isUUID(id)) {
      return null;
    }
    const connection = getConnection();

    const catagoryRepository = connection.getRepository(catagories);

    await catagoryRepository.delete({ id: id });

    return "Catagory is deleted Successfully";
  }
}

module.exports = catagoryDAL;
