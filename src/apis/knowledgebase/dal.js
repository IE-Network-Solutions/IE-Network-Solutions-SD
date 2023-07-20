const { getConnection } = require("typeorm");
const KnowledgeBase = require("../../models/KnowledgeBase"); 

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
      const connection = await getConnection();

      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      const knowledgebase = await knowledgebaseRepository.findOneBy({
        id: id,
      });
      return knowledgebase;
    } catch (error) {
      throw error;
    }
  }

  static async createKnowledgebase(data) {
    try {
      const { title, category, description } = data;

      // const id = 
      const connection = getConnection();

      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      const newKnowledgebase = await knowledgebaseRepository.create({
        // id,
        title,
        category,
        description,
      });

      await knowledgebaseRepository.save(newKnowledgebase);

      return newKnowledgebase;
    } catch (error) {
      throw error;
    }
  }

  static async updateOneKnowledgebase(id, updatedFields) {
    const connection = getConnection();

    const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

    const knowledgebase = await knowledgebaseRepository.findOneBy({ id });

    if (!knowledgebase) {
      throw new Error("Knowledgebase with the given id is not found");
    }
    
    // referesh the updated_at field.
    updatedFields.updated_at = new Date();

    knowledgebaseRepository.merge(knowledgebase, updatedFields);

    await knowledgebaseRepository.save(knowledgebase);

    // return updated knowlegebase data.
    return knowledgebase;
  }

  static async deleteOneKnowledgebase(id) {
    const connection = getConnection();

    const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

    await knowledgebaseRepository.delete({id});

    return "Test deleted Successfully";
  }
}

module.exports = KnowledgeBaseDAL;
