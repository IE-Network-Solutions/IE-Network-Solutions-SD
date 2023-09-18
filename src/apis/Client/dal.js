const { getConnection } = require("typeorm");
const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../../../utils/apperror");
const Company = require("../../models/Company");
const Ticket = require("../../models/Ticket");
const validateUuid = require("uuid-validate");


class ClientDAL {
  static async getClient() {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const clientRepository = await connection.getRepository(User);

      // find all client data
      const clients = await clientRepository.find({
        where: { user_type: "client" },
        select: ["id", "first_name", "last_name", "email", "user_type"],
        relations: ["company"],
      });
      if (!clients) {
        throw new Error("Error to fetch the data, try again!");
      }

      // return all fetched data
      return clients;
    } catch (error) {
      throw error
    }
  }

  static async getClientById(id) {
    try {
      if (!validateUuid(id)) throw "Invalid Id"

      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const clientRepository = await connection.getRepository(User);
      
      // get data
      const client = await clientRepository.findOne({
        where: { id },
        relations: ["company"],
      });

      // return single data
      return client;
    } catch (error) {
      throw error
    }
  }

  static async createClient(data) {
    try {
      const id = uuidv4();
      const { first_name, last_name, password, email, department, company_id } =
        data;

        if (!validateUuid(company_id)) throw "Invalid Id"
      // get connection from the pool
      const connection = getConnection();
      // create bridge for user
      const clientRepository = connection.getRepository(User);

      // check if the email is used or not.
      const emailCheck = await clientRepository.findOne({ where: { email }  });
      if (emailCheck) {
        throw "email is used ,please use another!";
      }

      const companyRepository = connection.getRepository(Company);
      const company = await companyRepository.findOne({ where: { id: company_id } });
      if(!company){
        throw "Company is not found!"
      }
      const newClient= await clientRepository.create({
        id,
        first_name,
        last_name,
        password,
        email,
        company: company,
      });
       await clientRepository.save(newClient);
      return newClient;
    } catch (error) {
      throw error 
    }
  }

  static async updateClient(id, updatedFields) {
   try {
    if (!validateUuid(id)) throw "Invalid Id"
    if (!validateUuid(updatedFields.company_id)) throw "Invalid Company Id"


     // get connection from the pool
     const connection = getConnection();

     // create bridge
     const clientRepository = connection.getRepository(User);
   const client =   await clientRepository.findOneBy({ id: id });
    if(!client) throw "Client not found"
    const companyRepository = connection.getRepository(Company);
    const company = await companyRepository.findOne({ where: { id: updatedFields.company_id } });
    if(!company){
      throw "Company is not found!"
    }
     clientRepository.merge(client, updatedFields);

    const clientCreate =  await clientRepository.save(client);
    if(!clientCreate) throw "Fail to update client , try again!" 
 
     return client;
   } catch (error) {
    throw error    
   }
  }

  static async getClientTickets(data) {
    try {
      const client = data;
      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const clientRepository = connection.getRepository(Ticket);

      const client_tickets = clientRepository.find({
        where: { client: client },
        relations: [
          "ticket_status",
          "ticket_type",
          "ticket_priority",
          "department",
        ],
      });
      return client_tickets;
    } catch (error) {
      throw error
    }
  }

  static async createTicket(data) {
    try {
      //Destructure user requests
      const { description, priority, subject, type, client, company } = data;

      const id = uuidv4();

      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const ticketRepository = connection.getRepository(Ticket);

      // create ticket
      const newTicket = await ticketRepository.create({
        description,
        subject,
        ticket_priority: priority,
        ticket_type: type,
        client: client,
        company: company,
      });
      await ticketRepository.save(newTicket);

      return newTicket;
    } catch (error) {
      throw error
    }
  }

  static async deleteClient(id) {
   try {
     // get connection from the pool
     const connection = getConnection();

    // create bridge
    const clientRepository = connection.getRepository(User);

    const deleted = await clientRepository.delete(id);
    if (!deleted) {
      throw "failed to delete client , try again!"
    }
    throw "client deleted Successfully";
  }
  catch(error){
    throw error
  }
}
}

module.exports = ClientDAL;
