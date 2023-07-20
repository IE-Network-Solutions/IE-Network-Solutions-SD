const { getConnection } = require("typeorm");
const Ticket = require("../../models/Ticket");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");
const TestDAL = require("../../apis/test/dal");
const Test = require("../../models/Test");
const AppError = require("../../../utils/apperror");
const User = require("../../models/User");
const TicketUser = require("../../models/TicketUSer");

class TicketDAL {
  static async getAllTickets() {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const ticketRepository = await connection.getRepository(Ticket);

      // find all ticket data
      return await ticketRepository.find();
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

      // get data
      return await ticketRepository.findOneBy({ id: id });
    } catch (error) {
      throw error;
    }
  }

  //This method implements to create new ticket
  static async createNewTicket(data) {
    try {
      //Destructure user requests
      const { status, description, priority, subject } = data;

      const id = uuidv4();

      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const ticketRepository = connection.getRepository(Ticket);

      // create ticket
      const newTicket = await ticketRepository.create({
        id,
        status,
        description,
        priority,
        subject,
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
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const ticketRepository = connection.getRepository(Ticket);

    // get the ticket
    const ticket = await ticketRepository.findOneBy({ id: ticketId });

    // get users
    const userRepository = connection.getRepository(User);
    const users = await userRepository.findByIds(usersIds);

    // create ticket_user instance to create the association
    const ticketUserRepository = connection.getRepository(TicketUser);
    const ticketUsers = users.map((user) => {
      const ticketUser = ticketRepository.create({
        ticket: ticket,
        user,
      });
      return ticketUser;
    });
    await ticketUserRepository.save(ticketUsers);

    //   return ticket users
    return ticketUsers;
  }
}

module.exports = TicketDAL;
