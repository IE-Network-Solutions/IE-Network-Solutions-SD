const { getConnection } = require("typeorm");
const Ticket = require("../../models/Ticket");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");

  const DBConnection = ()=>{
    
  }
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
      const { status, description, priority, subject, userId, assignedToId } = data;
      const uuid = uuidv4();
      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const ticketRepository = connection.getRepository(Ticket);

      // create ticket
      const newTicket = await ticketRepository.create({uuid, status, description, priority, subject, userId, assignedToId});
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
    console.log(ticket)
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
}

module.exports = TicketDAL;
