const { getConnection } = require("typeorm");
const KnowledgeBase = require("../../models/KnowledgeBase");

class KnowledgeBaseDAL {

  //This method implements to get all knowledge bases
  static async getAllKnowledgebase() {
    try {
      // Create connection
      const connection = await getConnection();

      // Inject knowledge base model
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);
      
      // Returns Knowledge base data relate with create by user
      return await knowledgebaseRepository.find({relations : ['createdBy']});
      
    } catch (error) {
     throw error
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
      return await knowledgebaseRepository.findOne({where: { id: id }, relations: ['createdBy']});

    } catch (error) {
      if (error.code === '23503') {
      return { Message : "Foreign key Constraint FAIL please insert correct id"};
    }
    }
  }

  // This method implements to create new knowledge base 
  static async createKnowledgebase(data) {
    try {

      // Accept all knowledge base values
      const { title, category, description, image, createdBy } = data;

      // Create connection
      const connection = getConnection();

      // Inject knowledge base model
      const knowledgebaseRepository = connection.getRepository(KnowledgeBase);

      // Create knowledge base value in memory
      const knowledgebase = await knowledgebaseRepository.create({
        title, category, description, image, createdBy });

      // Save knowledge base values and Return new data
      return await knowledgebaseRepository.save(knowledgebase);

    } catch (error) {
     if (error.code === '23503') {
      return { Message : "Foreign key Constraint FAIL please insert correct id"};
    }
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
    const knowledgebase = await knowledgebaseRepository.findOneBy({id : id});

    // Update knowledge base values
    knowledgebaseRepository.merge(knowledgebase, updatedFields);

  //Returns latest knowledge base values
    return await knowledgebaseRepository.save(knowledgebase);
  }
  catch(error){
     if (error.code === '23503') {
      return { Message : "Foreign key Constraint FAIL please insert correct id"};
    }
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
