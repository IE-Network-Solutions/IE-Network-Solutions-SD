const { getConnection } = require("typeorm");
const User = require("../../models/User");
const {v4: uuidv4} = require('uuid');

class ClientDAL {
  static async getClient() {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const clientRepository = await connection.getRepository(User);

      // find all client data
      const tests = await clientRepository.find();

      // return all fetched data
      return tests;
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
      const client = await clientRepository.findOneBy({
        id: id,
      });

      // return single data
      return client;
    } catch (error) {
      throw error;
    }
  }

  static async createClient(data) {
    try {
      const id = uuidv4();

        
      const {
         first_name,
        last_name,
        email,
        role,
        department,
        client_type, } = data;
      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const clientRepository = connection.getRepository(User);

      // create client
      const newClient = await clientRepository.create({ id,first_name,
        last_name,
        email,
        role,
        department,
        client_type });
      await clientRepository.save(newClient);
      // console.log(newTest);
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
    const client = await clientRepository.findOneBy({ id: id });
    if (!client) {
      throw new Error("client not found");
    }

    clientRepository.merge(client, updatedFields);
    await clientRepository.save(client);

    return client;
  }

  static async deleteClient(id) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const clientRepository = connection.getRepository(User);

    await clientRepository.delete(id);

    return "client deleted Successfully";
  }
}

module.exports = ClientDAL;
