const { getConnection } = require("typeorm");
const Ticket = require("../../models/Ticket");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const TestDAL = require("../../apis/test/dal");
const Test = require("../../models/Test");
const AppError = require("../../../utils/apperror");
const User = require("../../models/User");
const TicketUser = require("../../models/TicketUser");
const Type = require("../../models/Type");
const UserDAL = require("../users/dal");
const JunkTicket = require("../../models/JunkTicket");
const TeamUser = require("../../models/TeamUser");
const ClientDAL = require("../Client/dal");
const teamDAL = require("../team/dal");
const PriorityDAL = require("../priority/dal");
const TypeDAL = require("../type/dal");
const sortBy = require('../../../utils/sortor.utils');
const findAll = require('../../../utils/plugins/findAll.utils');
const _ = require('lodash');
const StatusDAL = require("../status/dal");


class TicketDAL {
  static async getAllTickets() {
    try {
      const is_deleted = false;
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const ticketRepository = await connection.getRepository(Ticket).extend({ findAll, sortBy });

      // fetch tickets with related data
      const tickets = await ticketRepository
        .createQueryBuilder("ticket")
        .leftJoin("ticket.assigned_users", "users")
        .leftJoin("ticket.ticket_type", "types")
        .leftJoin("ticket.ticket_priority", "priority")
        .leftJoin("ticket.ticket_status", "status")
        .leftJoin("ticket.created_by", "created_by")
        .leftJoin("ticket.client", "client")
        .leftJoin("ticket.team", "team")
        .leftJoin("ticket.company", "company")
        .leftJoin("ticket.comments", "comments")
        .select([
          "ticket.id",
          "ticket.subject",
          "ticket.description",
          "ticket.created_at",
          "ticket.due_date",
          "ticket.closed",
          "created_by",
          "team.id",
          "team.name",
          "types.type",
          "types.id",
          "priority.id",
          "priority.type",
          "status.id",
          "status.type",
          "status.status_color",
          // "department.id",
          // "department.type",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          // "users.department",
          "users.user_type",
          "client.id",
          "client.email",
          "client.first_name",
          "client.last_name",
          "client.user_type",
          "company.company_name",
          "company.description",
          "company.id",
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
        .where("ticket.is_deleted = :is_deleted", { is_deleted })
        .orderBy("ticket.created_at", "DESC")
        .getMany();

      // return all
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  static async getTicketBasedOnTeamAccess(id) {
    try {
      const is_deleted = false;
      // get connection from the pool
      const connection = getConnection();

      // create a bridg
      const userRepository = connection.getRepository(User);
      const tickets = userRepository.findOne({
        where: { id: id },
        relations: [
          "teams_access",
          "teams_access.tickets",
          "teams_access.tickets.assigned_users",
          "teams_access.tickets.ticket_type",
          "teams_access.tickets.ticket_priority",
          "teams_access.tickets.ticket_status",
          "teams_access.tickets.team",
          "teams_access.tickets.team.team_lead",
          "teams_access.tickets.client",
          "teams_access.tickets.company",
          "teams_access.tickets.comments",
          "teams_access.tickets.created_by",
        ],
      });

      return tickets;
    } catch (error) {
      throw error;
    }
  }
  //This method implemenets to get ticket by id
  static async getTicketById(id) {
    try {
      const is_deleted = false;
      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const ticketRepository = await connection.getRepository(Ticket);

      // fetch tickets with related data
      const ticket = await ticketRepository
        .createQueryBuilder("ticket")
        .leftJoin("ticket.assigned_users", "users")
        .leftJoin("ticket.ticket_type", "types")
        .leftJoin("ticket.ticket_priority", "priority")
        .leftJoin("ticket.ticket_status", "status")
        .leftJoin("ticket.team", "team")
        .leftJoin("team.team_lead", "team_lead")
        .leftJoin("ticket.client", "client")
        .leftJoin("ticket.company", "company")
        .leftJoin("ticket.comments", "comments")
        .select([
          "ticket.id",
          "ticket.subject",
          "ticket.description",
          "ticket.created_at",
          "ticket.due_date",
          "ticket.closed",
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
          "client.id",
          "client.email",
          "client.first_name",
          "client.last_name",
          "client.user_type",
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
          "team_lead.id",
          "team_lead.first_name",
        ])
        .where("ticket.id = :id", { id })
        .andWhere("ticket.is_deleted = :is_deleted", { is_deleted })
        .getOne();

      return ticket;
    } catch (error) {
      throw error;
    }
  }
  static async getAllJunkTickets() {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const ticketRepository = await connection.getRepository(JunkTicket);

      // get data
      return await ticketRepository.find();
    } catch (error) {
      throw error;
    }
  }

  static async getAllUnTransferedJunkTickets() {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const ticketRepository = await connection.getRepository(JunkTicket);

      // get data
      return await ticketRepository.findBy({
        isTransfered: false,
      });
    } catch (error) {
      throw error;
    }
  }

  static async getJunkTicketById(id) {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const ticketRepository = await connection.getRepository(JunkTicket);

      // get data
      return await ticketRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  static async transferJunkToTicker(data, id, user_id) {
    try {
      // Get a connection from the pool
      const connection = getConnection();

      // Create a bridge to the JunkTicket entity
      const junkTicketRepository = connection.getRepository(JunkTicket);

      // Find the ticket by its ID
      const ticket = await junkTicketRepository.findOneBy({ id });

      if (ticket) {
        ticket.isTransfered = true;

        // Save the updated ticket
        const updatedTicket = await junkTicketRepository.save(ticket);
        const client = await ClientDAL.getClientById(data.client_id)
        const user = await UserDAL.getOneUser(user_id)
        const team = await teamDAL.getTeam(data.team_id)
        const priority = await PriorityDAL.getPriority(data.priority_id)
        // const type = await TypeDAL.getOneType(data.type_id)

        const newT =
        {
          "subject": updatedTicket.subject,
          "description": updatedTicket.body || "No Description",
          ticket_priority: priority,
          team: team,
          // ticket_type: type,
          created_by: user,
          client: client
        }

        const transfer = await this.createNewTicket(newT)

        return { updateTicket: updatedTicket, transfer: transfer };
      } else {
        throw new Error(`Ticket with ID ${id} not found`);
      }
    } catch (error) {
      throw error;
    }
  }


  static async deleteJunkTicket(id) {
    try {
      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const junkTicketRepository = connection.getRepository(JunkTicket);

      return await junkTicketRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
  //This method implements to create new ticket
  static async createNewTicket(data) {
    try {
      //Destructure user requests
      const {
        status,
        description,
        priority,
        subject,
        team,
        type,
        client,
        company,
        agent_id,
        created_by,
      } = data;

      const id = uuidv4();

      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const ticketRepository = connection.getRepository(Ticket);

      // create ticket
      const newTicket = ticketRepository.create({
        id,
        status,
        description,
        priority,
        subject,
        ticket_priority: priority,
        ticket_status: status,
        ticket_type: type,
        team: team,
        client: client,
        company: company,
        created_by: created_by,
      });
      return await ticketRepository.save(newTicket);

    } catch (error) {
      throw error;
    }
  }

  static async updateTicket(id, updatedFields) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const ticketRepository = connection.getRepository(Ticket);

    const ticket = await ticketRepository.findOneBy({ id: id });
    if (!ticket) {
      throw new Error("Ticket is Not Found with the provided id");
    }

    const status = await StatusDAL.getStatus(updatedFields.status_id);

    if (status.type == "Closed") {
      await statusRepository.update(ticket, { ticket_status: status.id });
      await statusRepository.update(ticket, { closed: true });
    }
    const tickets = await ticketRepository.merge(ticket, updatedFields);
    const result = await ticketRepository.save(tickets);
    console.log("status", result);
    return result;
  }

  static async deleteTicketById(id) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const ticketRepository = connection.getRepository(Ticket);

    return await ticketRepository.delete(id);
  }

  static async assignUsersToTicket(ticketId, usersIds) {
    try {
      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const ticketRepository = connection.getRepository(Ticket);

      // get the ticket
      const ticket = await ticketRepository.findOneBy({
        id: ticketId,
      });

      // get users
      const userRepository = connection.getRepository(User);
      const users = await userRepository.findByIds(usersIds);

      // create ticket_user instance to create the association
      const ticketUserRepository = connection.getRepository(TicketUser);
      const ticketUsers = users.map((user) => {
        const ticketUser = ticketUserRepository.create({
          ticket: ticket,
          user,
        });
        return ticketUser;
      });
      await ticketUserRepository.save(ticketUsers);

      // return ticket users
      return ticketUsers;
    } catch (error) {
      throw error;
    }
  }

  static async removeAssignedUser(ticketId, userId) {
    try {
      // Establish the database connection from the pool
      const connection = await getConnection();

      // Fetch the ticket from the database
      const ticketRepository = connection.getRepository(Ticket);
      const ticket = await ticketRepository.findOneBy({ id: ticketId });

      // Fetch the user from the database
      const userRepository = connection.getRepository(User);
      const user = await userRepository.findOneBy({ id: userId });

      // Fetch the TicketUser entity representing the association
      const ticketUserRepository = connection.getRepository(TicketUser);
      const ticketUser = await ticketUserRepository.findOneBy({
        ticket_id: ticket.id,
        user_id: user.id,
      });

      if (!ticketUser) {
        new AppError("relation not found", 404);
      }

      // Remove the TicketUser association from the database
      await ticketUserRepository.remove(ticketUser);

      return ticket;
    } catch (error) {
      throw error;
    }
  }

  // filter by any query
  static async filterTicket(data) {
    const { ticket_priority, ticket_status, ticket_type, department } = data;
    const filteredData = data;

    // get connection from the pool
    const connection = getConnection();

    // create bridge to the db
    const ticketRepository = connection.getRepository(Ticket);
    const queryBuilder = await ticketRepository.createQueryBuilder("ticket");

    // prepare filter conditions based on the parameters sent
    const filterConditions = {};

    // check and assign ticket priority
    if (ticket_priority) {
      queryBuilder
        .innerJoin("ticket.ticket_priority", "priority")
        .where("priority.id = :ticket_priority", { ticket_priority });
    }
    // check and assign ticket status
    if (ticket_status) {
      queryBuilder
        .innerJoin("ticket.ticket_status", "status")
        .andWhere("status.id = :ticket_status", { ticket_status });
    }
    // check and assign ticket type
    if (ticket_type) {
      queryBuilder
        .innerJoin("ticket.ticket_type", "type")
        .andWhere("type.id = :ticket_type", { ticket_type });
    }
    // check and assign ticket department
    if (department) {
      queryBuilder
        .innerJoin("ticket.department", "department")
        .andWhere("department.id = :department", { department });
    }

    const tickets = await queryBuilder.getMany();
    return tickets;
  }

  // ticket total by status
  static async ticketsTotalByStatus() {
    // get connection from the pool
    const connection = getConnection();
    const is_deleted = false;
    // create bridge to the db
    const ticketRepository = connection.getRepository(Ticket);

    // Fetch tickets with related data and group by status
    const ticketStatusCounts = await ticketRepository
      .createQueryBuilder("ticket")
      .leftJoin("ticket.ticket_status", "status")
      .select([
        "status.id AS statusId",
        "status.type AS statusType",
        "COUNT(ticket.id) AS ticketCount",
      ])
      .where("ticket.is_deleted = :is_deleted", { is_deleted })
      .groupBy("status.id", "status.type")
      .orderBy("status.id")
      .getRawMany();

    return ticketStatusCounts;
  }
  static async groupAllTicketsByTeam() {
    try {
      const is_deleted = false;
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const ticketRepository = await connection.getRepository(Ticket);

      // fetch tickets with related data
      const tickets = await ticketRepository
        .createQueryBuilder("ticket")
        .leftJoin("ticket.assigned_users", "users")
        .leftJoin("ticket.ticket_type", "types")
        .leftJoin("ticket.ticket_priority", "priority")
        .leftJoin("ticket.ticket_status", "status")
        .leftJoin("ticket.created_by", "created_by")
        .leftJoin("ticket.client", "client")
        .leftJoin("ticket.team", "team")
        .leftJoin("ticket.company", "company")
        .leftJoin("ticket.comments", "comments")
        .select([
          "ticket.id",
          "ticket.subject",
          "ticket.description",
          "ticket.created_at",
          "ticket.due_date",
          "ticket.closed",
          "created_by",
          "types.type",
          "types.id",
          "priority.id",
          "priority.type",
          "status.id",
          "status.type",
          "status.status_color",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          "users.user_type",
          "client.id",
          "client.email",
          "client.first_name",
          "client.last_name",
          "client.user_type",
          "team.id",
          "team.name",
          "team.is_deleted",
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
          "ticket.team_id",
        ])
        .where("ticket.is_deleted = :is_deleted", { is_deleted })
        .orderBy("ticket.created_at", "DESC")
        .getMany();

      return tickets;
    } catch (error) {
      throw error;
    }
  }

  static async getAllTicketsCreatedByAgentByUserId(userId) {
    try {
      const connection = await getConnection();
      const userTicketRepository = await connection.getRepository(TicketUser);
      const result = await userTicketRepository.find({
        where: { user_id: userId },
      });
      // console.log("result", result)
      return result;
    } catch (error) {
      throw error;
    }
  }
  // tickets count for each team
  static async getAllTeamTicketsCount() {
    // get connection from the pool
    const connection = getConnection();

    // create bridge to the db
    const ticketRepository = connection.getRepository(Ticket);

    const data = await ticketRepository
      .createQueryBuilder("ticket")
      .leftJoin("ticket.team", "team")
      .select([
        "team.id AS teamId",
        "team.name AS teamName",
        "COUNT(ticket.id) as ticketCount",
      ])
      .groupBy("team.id", "team.name")
      .orderBy("team.id")
      .getRawMany();

    return data;
  }

  // assigned tickets for logged in user status not closed 
  static async getAssignedTickets(userId) {

    const connection = getConnection();
    const name = "Closed";
    const userRepository = connection.getRepository(User);
    const ticketRepository = connection.getRepository(Ticket);
    const userTasks = await userRepository
      .createQueryBuilder("user")
      .leftJoin("user.assigned_tickets", "ticket")
      .leftJoin("ticket.ticket_status", "status")
      .select([
        "user.id",
        "user.first_name",
        "user.last_name",
        "ticket.id",
        "ticket.subject",
        "ticket.description",
      ])
      .where("status.type != :name", { name: name })
      .andWhere("user.id = :id", { id: userId })
      .getRawMany();

    return userTasks;
  }

  static async getAgentStatusForTeamById(teamId) {
    const connection = getConnection();
    const userTeamRepository = await connection.getRepository(TeamUser);
    const teamUser = await userTeamRepository.find({ where: { team_id: teamId } });
    return teamUser;
  }

  static async getAllAgentStatus() {
    const connection = getConnection();
    const userTeamRepository = await connection.getRepository(TeamUser);
    return await userTeamRepository.find();
  }

  static async getTicketUserByUserId(userId) {

    const connection = getConnection();
    const ticketUserRepository = await connection.getRepository(TicketUser);
    const ticketUser = await ticketUserRepository.find({
      where: { user_id: userId }, relations: ["ticket.ticket_status", "user", "user.role"], groupBy: "ticket.ticket_status.type"
    });
    return ticketUser;
  }
  static async getTeamTicketByTeamId(teamId) {
    const connection = getConnection();
    const ticketRepository = connection.getRepository(Ticket);
    const tickets = await ticketRepository
      .createQueryBuilder("ticket")
      .leftJoinAndSelect("ticket.team", "team") // Assuming there's a relationship between Ticket and Team
      .leftJoinAndSelect("ticket.ticket_status", "ticket_status")
      .where("ticket.team_id = :teamId", { teamId })
      .getMany();

    return tickets;
  }

  static async getAllTicketsForCompany(userId) {
    try {
      // const user = UserDAL.getOneUser(userId)

      // console.log(user);


    } catch (error) {
      throw error
    }
  }

  static async closeTicket(ticketId, statusId) {
    try {
      const connection = getConnection();
      const statusRepository = await connection.getRepository(Ticket);
      const status = await StatusDAL.getStatus(statusId);
      if (status.type == "Closed") {
        await statusRepository.update(ticketId, { ticket_status: statusId });
        return await statusRepository.update(ticketId, { closed: true });
      }
      return await statusRepository.update(ticketId, { ticket_status: statusId });

    } catch (error) {
      throw error
    }
  }
}



module.exports = TicketDAL;
