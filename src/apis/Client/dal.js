const { getConnection } = require("typeorm");
const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../../../utils/apperror");
const Company = require("../../models/Company");
const Ticket = require("../../models/Ticket");
const validateUuid = require("uuid-validate");
const Team = require("../../models/Team");
const TicketUser = require("../../models/TicketUser");
const TicketDAL = require("../tickets/dal");
const { forEach } = require("../../../utils/permissionConstants");
const TeamUser = require("../../models/TeamUser");


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
        .leftJoin("user.teams_access", "teams_access")
        .leftJoin("tickets.ticket_type", "types")
        .leftJoin("tickets.ticket_priority", "priority")
        .leftJoin("tickets.ticket_status", "status")
        .leftJoin("tickets.team", "team")
        .leftJoin("tickets.created_by", "created_by")
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
          "user.phone_number",
          "user.user_type",
          "teams_access.id",
          "teams_access.name",
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
          "created_by.id",
          "created_by.first_name",
          "created_by.last_name",
          "created_by.email",
          "created_by.user_type"
        ])
        .getMany();

      // return all fetched data
      return client;
    } catch (error) {
      throw error
    }
  }

  static async getClientById(id) {
    try {
      if (!validateUuid(id)) throw "Invalid Id"

      const is_deleted = false;
      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const clientRepository = await connection.getRepository(User);

      // get data
      const client = await clientRepository
        .createQueryBuilder("user")
        .leftJoin("user.client_tickets", "tickets")
        .leftJoin("user.teams_access", "teams_access")
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
          "user.phone_number",
          "user.user_type",
          "teams_access.id",
          "teams_access.name",
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
      throw error
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
        profile_pic,
        phone_number,
        created_by
      } = data;
      // get connection from the pool
      const connection = getConnection();
      // create bridge for user
      const clientRepository = connection.getRepository(User);

      // check if the email is used or not.
      const emailCheck = await clientRepository.findOne({ where: { email } });
      if (emailCheck) {
        throw "email is used ,please use another!";
      }

      const companyRepository = connection.getRepository(Company);
      const company = await companyRepository.findOne({ where: { id: company_id } });
      if (!company) {
        throw "Company is not found!"
      }
      const newClient = await clientRepository.create({
        id,
        first_name,
        last_name,
        password,
        email,
        company: company,
        profile_pic: profile_pic,
        phone_number,
        created_by: created_by

      });

      await clientRepository.save(newClient);
      return newClient;
    } catch (error) {
      throw error
    }
  }

  static async updateClient(id, updatedFields) {
    try {
      // create bridge
      const connection = getConnection();
      const clientRepository = connection.getRepository(User);
      const client = await clientRepository.findOne({ where: { id: id } });
      if (!client) {
        throw new Error("client not found!");
      }
      await clientRepository.update(id, {
        first_name: updatedFields?.first_name,
        last_name: updatedFields?.last_name,
        profile_pic: updatedFields?.profile_pic,
        user_type: updatedFields?.user_type,
        phone_number: updatedFields?.phone_number,
      });

      const userTeamRepository = connection.getRepository(TeamUser);
      await userTeamRepository.delete({ user_id: id });

      if (updatedFields.team_id) {
        const teams = updatedFields.team_id;
        const teamEntities = teams.map((teamId) => ({
          user_id: id,
          team_id: teamId,
        }));
        await userTeamRepository.save(teamEntities);

        return client;
      }
    } catch (error) {
      throw error;
    }
  }

  static async getClientTickets(client) {
    try {
      const connection = getConnection();
      const clientRepository = await connection.getRepository(Ticket);
      const client_tickets = await clientRepository
        .createQueryBuilder("ticket")
        .leftJoinAndSelect("ticket.ticket_status", "ticket_status")
        .leftJoinAndSelect("ticket.company", "company")
        .leftJoinAndSelect("ticket.assigned_users", "assigned_users")
        .leftJoinAndSelect("ticket.ticket_type", "ticket_type")
        .leftJoinAndSelect("ticket.ticket_priority", "ticket_priority")
        .leftJoinAndSelect("ticket.team", "team")
        .leftJoinAndSelect("ticket.comments", "comments")
        .leftJoinAndSelect("ticket.client", "client")
        .where("ticket.client = :clientId", { clientId: client.id })
        .getMany();

      return client_tickets;
    } catch (error) {
      throw error
    }
  }

  static async createTicket(data) {
    try {
      //Destructure user requests
      const { description, subject, type, client, company } = data;

      const id = uuidv4();

      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const ticketRepository = connection.getRepository(Ticket);
      const sub = await this.generateTicketNumber(data?.subject);
      // create ticket
      const newTicket = await ticketRepository.create({
        description,
        subject : sub,
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

  static async generateTicketNumber(ticketName) {
    try {
      const connection = getConnection();
      const ticketRepository = connection.getRepository(Ticket);

      const ticket = await ticketRepository.find();

      // Generate the padded ticket number
      const fullTicketNumber = ticket.length + 1;
      const formattedNumber = String(fullTicketNumber).padStart(6, '0');
      return `${formattedNumber}/${new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}/EXTERNAL/${ticketName}`;

    } catch (error) {
      console.error('Error in generateTicketNumber:', error);
      throw error; // Rethrow the error to indicate the issue
    }
  }

  static async deleteClient(id) {
    const connection = getConnection();
    const clientRepository = connection.getRepository(User);
    return await clientRepository.delete({ id });
  }

  static async getAllClientTicketsByAdmin() {
    try {
      const connection = getConnection();
      const clientRepository = connection.getRepository(Ticket);
      return await clientRepository.find({ relations: ['created_by', 'team'] });
    }
    catch (error) {
      throw error
    }
  }

  static async getClientTicketById(ticketId) {
    const connection = getConnection();
    const clientRepository = await connection.getRepository(Ticket);
    return clientRepository.findOne({ where: { id: ticketId }, relations: ["client", "team"] });
  }

  static async assignClientTicketToTeamByAdmin(ticketId, teamsId) {
    try {
      const connection = getConnection();
      const ticketRepository = await connection.getRepository(Ticket);

      teamsId.map(async (teamId) => {
        await ticketRepository.update(ticketId, { team: teamId });
      })

      return await this.getClientTicketById(ticketId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ClientDAL;
