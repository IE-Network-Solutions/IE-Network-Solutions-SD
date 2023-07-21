const { getConnection } = require("typeorm");
const KnowledgeBase = require("../../models/KnowledgeBase");
const { validate: isUUID } = require("uuid");
const userDAL = require('../users/dal');
const AppError = require('../../../utils/apperror');

class KnowledgeBaseDAL {

  //This method implements to get all knowledge bases
  static async getAllKnowledgebase() {
    try {
      // Create connection
      const connection = await getConnection();

      // Inject knowledge base model
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);
      
      // Returns Knowledge base data relate with create by user
      return await knowledgebaseRepository.find({relations : ['created_by']});
      
    } catch (error) {
      throw error;
    }
  }

  // This method implements to get knowledge base with id
  static async getKnowledgebaseById(id) {
    try {

      // Create connection
      const connection = await getConnection();

      // Inject knowledge base model 
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

    // Returns Knowledge base data relate with create by user
      return await knowledgebaseRepository.findOne({where: { id: id }, relations: ['created_by']});

    } catch (error) {
      throw error;
    }
  }

  // This method implements to create new knowledge base 
  static async createKnowledgebase(data) {
    try {

      // Accept all knowledge base values
      const { title, category, description, image, user_Id } = data;

      // Create connection
      const connection = getConnection();

      // Inject knowledge base model
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      // Create knowledge base value in memory
      const Knowledgebase = await knowledgebaseRepository.create({
        title, category, description, image, user_Id });

      // Save knowledge base values and Return new data
      return await knowledgebaseRepository.save(Knowledgebase);

    } catch (error) {
      throw error;
    }
  }

  // This method implements to update knowledge base values
  static async updateOneKnowledgebase(id, updatedFields) {
    try
    {
    // Create connections
    const connection = getConnection();

    //Inject knowledge base model
    const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

    // Returns Update values of knowledge base
    const knowledgebase = await knowledgebaseRepository.findOneBy({ id });

    // Update knowledge base values
    knowledgebaseRepository.merge(knowledgebase, updatedFields);

  //Returns latest knowledge base values
    return await knowledgebaseRepository.save(knowledgebase);
  }
  catch(error){
    throw error
  }
}

  // This method implements to delete knowledge base by id
  static async deleteOneKnowledgebase(id) {
    try
    {
      // Create connections
      const connection = getConnection();

      // Inject knowledge base model
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      return await knowledgebaseRepository.delete({ id });
    }
    catch(error){
      throw error;
    }
  }
}

module.exports = KnowledgeBaseDAL;
