const { getConnection } = require("typeorm");
const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../../../utils/apperror");
const Company = require("../../models/Company");
const Ticket = require("../../models/Ticket");

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
      const client = await clientRepository.findOne({
        where: { id },
        relations: ["company"],
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
        password,
        email,
        department,
        company_id,
        user_profile,
        phone_number,
      } = data;
      // get connection from the pool
      const connection = getConnection();
      // create bridge for user
      const clientRepository = connection.getRepository(User);

      // check if the email is used or not.
      const emailCheck = await clientRepository.findOne({ where: { email } });
      if (emailCheck) {
        throw new Error("email is used , use another!");
      }

      let company;

      const companyRepository = connection.getRepository(Company);
      company = await companyRepository.findOne({ where: { id: company_id } });
      if (!company) {
        throw new Error("company not found, use another company id!");
      }

      // create client
      const newClient = await clientRepository.create({
        id,
        first_name,
        last_name,
        password,
        email,
        company: company,
        profile_pic: user_profile,
        phone_number,
      });
      const clientCreated = await clientRepository.save(newClient);
      if (!clientCreated) {
        throw new Error("client create faild, try again!");
      }
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
      throw new Error("client not found!");
    }

    clientRepository.merge(client, updatedFields);
    await clientRepository.save(client);

    return client;
  }

  static async getClientTickets(data) {
    try {
      const client = data;
      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const clientRepository = connection.getRepository(Ticket);

      const client_tickets = clientRepository.find({
        where: { client: client, is_deleted: false },
        relations: [
          "ticket_status",
          "ticket_type",
          "ticket_priority",
          "department",
          "comments",
        ],
      });
      return client_tickets;
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  static async deleteClient(id) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const clientRepository = connection.getRepository(User);

    const deleted = await clientRepository.delete(id);
    if (!deleted) {
      throw new Error("failed to delete client , try again!");
    }
    return "client deleted Successfully";
  }
}

module.exports = ClientDAL;
