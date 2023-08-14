const { getConnection } = require("typeorm");
const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../../../utils/apperror");
const Company = require("../../models/Company");
const Ticket = require("../../models/Ticket");

class ClientDAL {
  static async getClient() {
    try {
      const user_type = "client";
      const is_deleted = false;
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const clientRepository = await connection.getRepository(User);

      // find all client data
      // get data
      const client = await clientRepository
        .createQueryBuilder("user")
        .leftJoin("user.client_tickets", "tickets")
        .leftJoin("tickets.ticket_type", "types")
        .leftJoin("tickets.ticket_priority", "priority")
        .leftJoin("tickets.ticket_status", "status")
        .leftJoin("tickets.team", "team")
        .leftJoin("team.team_lead", "team_lead")
        .leftJoin("tickets.client", "client")
        .leftJoin("tickets.comments", "comments")
        .leftJoin("user.company", "company")
        .leftJoin("tickets.assigned_users", "users")
        .where("user.user_type = :user_type", { user_type })
        .andWhere("user.is_deleted = :is_deleted", { is_deleted })
        .select([
          "user.id",
          "user.first_name",
          "user.last_name",
          "user.email",
          "user.profile_pic",
          "company.id",
          "company.company_name",
          "company.description",
          "tickets.id",
          "tickets.subject",
          "tickets.description",
          "tickets.created_at",
          "tickets.due_date",
          "tickets.closed",
          "types.type",
          "types.id",
          "priority.id",
          "priority.type",
          "status.id",
          "status.type",
          "status.status_color",
          "team.id",
          "team.name",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          "users.team",
          "users.user_type",
          "company.company_name",
          "company.description",
          "company.id",
          "comments.id",
          "comments.title",
          "comments.description",
          "comments.is_private",
          "comments.emailTo",
          "comments.emailCc",
          "comments.is_escalation",
          "comments.created_at",
          "comments.updated_at",
        ])
        .getMany();

      // return all fetched data
      return client;
    } catch (error) {
      throw error;
    }
  }

  static async getClientById(id) {
    try {
      const is_deleted = false;
      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const clientRepository = await connection.getRepository(User);

      // get data
      const client = await clientRepository
        .createQueryBuilder("user")
        .leftJoin("user.client_tickets", "tickets")
        .leftJoin("tickets.ticket_type", "types")
        .leftJoin("tickets.ticket_priority", "priority")
        .leftJoin("tickets.ticket_status", "status")
        .leftJoin("tickets.team", "team")
        .leftJoin("team.team_lead", "team_lead")
        .leftJoin("tickets.client", "client")
        .leftJoin("tickets.comments", "comments")
        .leftJoin("user.company", "company")
        .leftJoin("tickets.assigned_users", "users")
        .where("user.id = :id", { id })
        .andWhere("user.is_deleted = :is_deleted", { is_deleted })
        .select([
          "user.id",
          "user.first_name",
          "user.last_name",
          "user.email",
          "user.profile_pic",
          "user.user_type",
          "company.id",
          "company.company_name",
          "company.description",
          "tickets.id",
          "tickets.subject",
          "tickets.description",
          "tickets.created_at",
          "tickets.due_date",
          "tickets.closed",
          "types.type",
          "types.id",
          "priority.id",
          "priority.type",
          "status.id",
          "status.type",
          "status.status_color",
          "team.id",
          "team.name",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          "users.team",
          "users.user_type",
          "company.company_name",
          "company.description",
          "company.id",
          "comments.id",
          "comments.title",
          "comments.description",
          "comments.is_private",
          "comments.emailTo",
          "comments.emailCc",
          "comments.is_escalation",
          "comments.created_at",
          "comments.updated_at",
        ])
        .getOne();

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
    const client = await clientRepository.findOne({ where: { id: id } });
    if (!client) {
      throw new Error("client not found!");
    }
    console.log("kiraaaaaa", updatedFields);
    clientRepository.merge(client, updatedFields);

    // update if company is changed
    if (updatedFields.company) {
      client.company = updatedFields.company;
    }

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
