const { getConnection } = require("typeorm");
const User = require("../../models/User");
const {v4: uuidv4} = require('uuid');
const AppError = require("../../../utils/apperror");
const Company = require("../../models/Company");

class ClientDAL {
  static async getClient() {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const clientRepository = await connection.getRepository(User);

      // find all client data
      const clients = await clientRepository.find();
      // return all fetched data
      return clients;
    } catch (error) {
      throw error;
    }
  }

  static async getClientById(id) {
    try {

      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const clientRepository = await connection.getRepository(User);
      
      // get data
      const client =   await clientRepository.findOne(

        {
          where:{id:id},
          relations: ["company"],
        }
      );
     
      // return single data
      return client;
    } catch (error) {
      throw error;
      // return  new Error("Client clioent is not found, use another CLient id!")

    }
  }

  static async createClient(data ) {
    try {
      const id = uuidv4();
      const {
         first_name,
        last_name,
        password,
        email,
        role,
        department,
        company_id,
        client_type, } = data;
      // get connection from the pool
      const connection = getConnection();
      // create bridge for user
      const clientRepository = connection.getRepository(User);
      
      // check if the email is used or not.
      await clientRepository.findOne({where:{email}})
     
      let company;

      const companyRepository = connection.getRepository(Company);
       await companyRepository.findOneBy({id:company_id})
     
      // create client
      const newClient = await clientRepository.create({ id,first_name,
        last_name,
        password,
        email,
        role,
        department,
        company_id,
        user_type:client_type,
        company:company
        });
     await clientRepository.save(newClient);
     
     return newClient;
    } catch (error) {
      throw error;
      
    }
  }

  static async updateClient(id, updatedFields) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const clientRepository = connection.getRepository(User);
    await clientRepository.findOneBy({ id: id });
   

   clientRepository.merge(client, updatedFields);
    await clientRepository.save(client);

    return client;
  }

  static async deleteClient(id) {
   try {
     // get connection from the pool
     const connection = getConnection();

     // create bridge
     const clientRepository = connection.getRepository(User);
 
     const deleted=  await clientRepository.delete(id);
     
     return "client deleted Successfully";
   }
   catch (error) {
    throw error
   }
  }
}

module.exports = ClientDAL;
