const { getConnection } = require("typeorm");
const KnowledgeBase = require("../../models/KnowledgeBase");
const { validate: isUUID } = require("uuid");
class KnowledgeBaseDAL {


  //This method implements to get all knowledge bases
  static async getKnowledgeBases() {
    try {
      // Create connection
      const connection = await getConnection();

      // Inject knowledge base model
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      // Returns Knowledge base data relate with create by user
      return await knowledgebaseRepository.find({ relations: ['createdBy', 'catagoryId'] });

    } catch (error) {
      throw error
    }
  }

  // This method implements to get knowledge base with id
  static async getKnowledgeBaseById(id) {
    try {

      // Create connection
      const connection = await getConnection();

      // Inject knowledge base model 
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      // Returns Knowledge base data relate with create by user
      return await knowledgebaseRepository.findOne({ where: { id: id }, relations: ['createdBy', 'catagoryId'] });

    } catch (error) {
      throw error;
    }
  }

  // This method implements to create new knowledge base 
  static async createKnowledgeBase(data) {
    try {

      // Accept all knowledge base values
      const { title, category, description, image, createdBy, catagoryId } = data;

      // Create connection
      const connection = getConnection();

      // Inject knowledge base model
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      // Create knowledge base value in memory
      const knowledgebase = await knowledgebaseRepository.create({
        title, category, description, image, createdBy, catagoryId
      });

      // Save knowledge base values and Return new data
      return await knowledgebaseRepository.save(knowledgebase);


    } catch (error) {
      if (error.code === '23503') {
        return { Message: "Foreign key Constraint FAIL please insert correct id" };
      }
    }
  }

  // This method implements to update knowledge base values
  static async updatedKnowledgeBaseById(id, updatedFields) {
    try {
      // Create connections
      const connection = getConnection();

      //Inject knowledge base model
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      // Returns Update values of knowledge base
      const knowledgebase = await knowledgebaseRepository.findOneBy({ id: id });

      // Update knowledge base values
      const result = await knowledgebaseRepository.merge(knowledgebase, updatedFields);

      //Returns latest knowledge base values
      return await knowledgebaseRepository.save(result);
    }
    catch (error) {
      if (error.code === '23503') {
        return { Message: "Foreign key Constraint FAIL please insert correct id" };
      }
    }
  }

  // This method implements to delete knowledge base by id
  static async deleteKnowledgeBaseById(id) {
    try {
      // Create connections
      const connection = getConnection();

      // Inject knowledge base model
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      return await knowledgebaseRepository.delete({ id });
    }
    catch (error) {
      throw error;
    }
  }

  static async updatedKnowledgeBaseById(id, updatedFields) {
    try {
      // check the validity of the id format.
      if (!isUUID(id)) {
        return null;
      }

      // form connection
      const connection = await getConnection();
      const knowledgeBaseRepository = connection.getRepository(KnowledgeBase);

      // refresh the updated_at field.
      updatedFields.updated_at = new Date();

      const updatedKnowledgeBase = await knowledgeBaseRepository.update({ id: id }, updatedFields)

      // return updated knowledgeBase data.
      return updatedKnowledgeBase;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = KnowledgeBaseDAL;
