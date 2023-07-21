const { getConnection } = require("typeorm");
const KnowledgeBase = require("../../models/KnowledgeBase");
const { validate: isUUID } = require("uuid");

class KnowledgeBaseDAL {
  static async getAllKnowledgebase() {
    try {
      const connection = await getConnection();

      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      const knowledgebases = await knowledgebaseRepository.find();
      // return all fetched data.
      return knowledgebases;
    } catch (error) {
      throw error;
    }
  }

  static async getKnowledgebaseById(id) {
    try {
      // check the validity of the id format.
      if (!isUUID(id)) {
        return null;
      }

      // form connection
      const connection = await getConnection();
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      // fetch data.
      const knowledgebase = await knowledgebaseRepository.findOneBy({ id: id });
      return knowledgebase;
    } catch (error) {
      throw error;
    }
  }

  static async createKnowledgebase(data) {
    try {
      const { title, category, description, images, user_Id } = data;

      // const id =
      const connection = getConnection();

      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      const newKnowledgebase = await knowledgebaseRepository.create({
        title,
        category,
        description,
        images,
        user_Id
      });

      await knowledgebaseRepository.save(newKnowledgebase);

      return newKnowledgebase;
    } catch (error) {
      throw error;
    }
  }

  static async updateOneKnowledgebase(id, updatedFields) {
    // check the validity of the id format.
    if (!isUUID(id)) {
      return null;
    }

    // form connection
    const connection = getConnection();
    const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

    // fetch the knowledgebase to be updated
    const knowledgebase = await knowledgebaseRepository.findOneBy({ id });

    // if no know ledgebase
    if (!knowledgebase) {
      throw new Error("Knowledgebase with the given id is not found");
    }

    // referesh the updated_at field.
    updatedFields.updated_at = new Date();

    // update
    knowledgebaseRepository.merge(knowledgebase, updatedFields);
    await knowledgebaseRepository.save(knowledgebase);

    // return updated knowlegebase data.
    return knowledgebase;
  }

  static async deleteOneKnowledgebase(id) {
    // check the validity of the id format.
    if (!isUUID(id)) {
      return null;
    }
    const connection = getConnection();

    const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

    await knowledgebaseRepository.delete({ id });

    return "Test deleted Successfully";
  }
}

module.exports = KnowledgeBaseDAL;
