const { getConnection } = require("typeorm");
const Ticket = require("../../models/Ticket");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const PriorityDAL = require("../../apis/priority/dal");
const StatusDAL = require("../../apis/status/dal");
const DepartmentDAL = require("../../apis/department/dal");
const TypeDAL = require("../../apis/type/dal");
const Test = require("../../models/Test");
const AppError = require("../../../utils/apperror");
const User = require("../../models/User");
const TicketUser = require("../../models/TicketUser");

class TicketDAL {
  static async getAllTickets() {
    try {
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
        .leftJoin("ticket.department", "department")
        .addSelect([
          "ticket.id",
          "ticket.subject",
          "ticket.description",
          "types.type",
          "types.id",
          "priority.id",
          "priority.type",
          "status.id",
          "status.type",
          "status.status_color",
          "department.id",
          "department.type",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          "users.department",
          "users.user_type",
        ])
        .addSelect("types.*")
        .getMany();

      // return all
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  //This method implemenets to get ticket by id
  static async getTicketById(id) {
    try {
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
        .leftJoin("ticket.department", "department")
        .addSelect([
          "ticket.id",
          "ticket.subject",
          "ticket.description",
          "types.type",
          "types.id",
          "priority.id",
          "priority.type",
          "status.id",
          "status.type",
          "status.status_color",
          "department.id",
          "department.type",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          "users.department",
          "users.user_type",
        ])
        .where("ticket.id = :id", { id })
        .getOne();

      return ticket;
    } catch (error) {
      throw error;
    }
  }

  //This method implements to create new ticket
  static async createNewTicket(data) {
    try {
      //Destructure user requests
      const {
        status_id,
        description,
        priority_id,
        subject,
        department_id,
        type_id,
      } = data;

      const id = uuidv4();

      // get connection from the pool
      const connection = getConnection();

      // get priority
      const priority = await PriorityDAL.getPriority(priority_id);

      if (!priority) {
        return new AppError("such priority does not exist", 404);
      }

      // get status
      const status = await StatusDAL.getStatus(status_id);
      if (!status) {
        return new AppError("status does not exist", 404);
      }

      // get type
      const type = await TypeDAL.getOneType(type_id);
      if (!type) {
        return new AppError("type does not exist", 404);
      }

      // get department
      const department = await DepartmentDAL.getDepartment(department_id);
      if (!department) {
        return new AppError("department does not exist", 404);
      }
      console.log(type);
      // create bridge
      const ticketRepository = connection.getRepository(Ticket);

      // create ticket
      const newTicket = await ticketRepository.create({
        description,
        subject,
        ticket_priority: priority,
        ticket_status: status,
        ticket_type: type,
        department: department,
      });
      await ticketRepository.save(newTicket);

      return newTicket;
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
    console.log(ticket);
    if (!ticket) {
      throw new Error("Ticket is Not Found with the provided id");
    }

    ticketRepository.merge(ticket, updatedFields);
    return await ticketRepository.save(ticket);
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

      //   return ticket users
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
}

module.exports = TicketDAL;
