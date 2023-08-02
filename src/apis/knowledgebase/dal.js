const { getConnection } = require("typeorm");
const KnowledgeBase = require("../../models/KnowledgeBase");
const { validate: isUUID } = require("uuid");

class KnowledgeBaseDAL {
  static async getAllKnowledgeBase() {
    try {
      const connection = await getConnection();
      const knowledgeBaseRepository = connection.getRepository(KnowledgeBase);

      const knowledgeBases = await knowledgeBaseRepository.find();
      // return all fetched data.
      return knowledgeBases;
    } catch (error) {
      throw error;
    }
  }

  static async getKnowledgeBaseById(id) {
    try {
      // check the validity of the id format.
      if (!isUUID(id)) {
        return null;
      }

      // form connection
      const connection = await getConnection();
      const knowledgeBaseRepository = connection.getRepository(KnowledgeBase);

      // fetch data.
      const knowledgeBase = await knowledgeBaseRepository.findOneBy({ id: id });
      return knowledgeBase;
    } catch (error) {
      throw error;
    }
  }

  static async createKnowledgeBase(data) {
    try {
      const { title, category, description } = data;

      // const id =
      const connection = getConnection();

      const knowledgeBaseRepository = connection.getRepository(KnowledgeBase);

      const newKnowledgeBase = await knowledgeBaseRepository.create({
        title,
        category,
        description,
      });

      await knowledgeBaseRepository.save(newKnowledgeBase);

      return newKnowledgeBase;
    } catch (error) {
      throw error;
    }
  }

  static async updateOneKnowledgeBase(id, updatedFields) {
    try {
      // check the validity of the id format.
      if (!isUUID(id)) {
        return null;
      }

      // form connection
      const connection = await getConnection();
      const knowledgeBaseRepository = connection.getRepository(KnowledgeBase);

      // get knowledgeBase to be updated.
      // const knowledgeBase = knowledgeBaseRepository.findOneBy({ id: id });

      // refresh the updated_at field.
      updatedFields.updated_at = new Date();

      // // update
      // knowledgeBaseRepository.merge(knowledgeBase, updatedFields);
      // await knowledgeBaseRepository.save(knowledgeBase);

      const updatedKnowledgeBase = await knowledgeBaseRepository.update({
        id: id,
      }, updatedFields)

      // return updated knowledgeBase data.
      return updatedKnowledgeBase;
    } catch (error) {
      throw error;
    }
  }

  static async deleteOneKnowledgeBase(id) {
    try {
      // check the validity of the id format.
      if (!isUUID(id)) {
        return null;
      }
      // Form connection
      const connection = getConnection();
      const knowledgeBaseRepository = connection.getRepository(KnowledgeBase);

      await knowledgeBaseRepository.delete({ id });

      return "KnowledgeBase deleted Successfully.";
    } catch (error) {
      throw error;
    }
  }

  static async likeKnowledgeBase(knowledgeBaseID, userID) {
    try {
      // Form connection
      const connection = getConnection();
      const knowledgeBaseRepository = connection.getRepository(KnowledgeBase);

      // Get the current likers array
      const knowledgeBase = await knowledgeBaseRepository.findOneBy({ id: knowledgeBaseID });

      let likers = knowledgeBase.likers;
      if (!likers) {
        likers = [];
      }

      // Remove the UUID to the likers array
      likers.push(userID);
      knowledgeBase.likers = likers;

      // Save the knowledge base
      await knowledgeBaseRepository.save(knowledgeBase);

      return "KnowledgeBase updated Successfully.";
    } catch (error) {
      throw error;
    }
  }

  static async unlikeKnowledgeBase(knowledgeBaseID, userID) {
    try {
      // Form connection
      const connection = getConnection();
      const knowledgeBaseRepository = connection.getRepository(KnowledgeBase);

      // Get the current likers array
      const knowledgeBase = await knowledgeBaseRepository.findOneBy({ id: knowledgeBaseID });

      let likers = knowledgeBase.likers;
      if (!likers) {
        likers = [];
      }

      // Remove the UUID to the likers array
      const index = likers.indexOf(userID);
      if (index !== -1) {
        likers.splice(index, 1);
      }
      knowledgeBase.likers = likers;

      // Save the knowledge base
      await knowledgeBaseRepository.save(knowledgeBase);

      return "KnowledgeBase updated Successfully.";
    } catch (error) {
      throw error;
    }
  }



}

module.exports = KnowledgeBaseDAL;
