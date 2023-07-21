const { getConnection } = require("typeorm");
const catagories = require("../../models/Catagoreis");
const { validate: isUUID } = require("uuid");
const Catagories = require("../../models/Catagoreis");

class catagoryDAL {
  static async getAllCatagories() {
    try {
      const connection = await getConnection();

      const catagoyRepository = connection.getRepository(catagories);

      const catagories = await catagoyRepository.find();
      // return all fetched data.
      return catagories;
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
      const catagory = await catagoryRepository.findOneBy({ id: id });
      return catagory;
    } catch (error) {
      throw error;
    }
  }

  static async createCatagory(data) {
    try {
      const { title, category, description } = data;

      // const id =
      const connection = getConnection();

      const catagoryRepository = connection.getRepository(catagories);

      const catagory = await catagoryRepository.create({
        title,
        category,
        description,
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
