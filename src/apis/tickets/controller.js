const AppError = require("../../../utils/apperror");
const TicketDAL = require("./dal");
const TestDAL = require('../../apis/test/dal')

//This method implements to get all tickets
exports.getAllTickets = async (req, res, next) => {
  try {
    //   get all tickets
    const ticket = await TicketDAL.getAllTickets();

    // check if tickets are exist
    if (!ticket) {
      // return custom error
      return next(new AppError("No Ticket data found"));
    }

    // response
    res.status(200).json({
      status: "Success",
      data: ticket,
    });
  } catch (error) {
    throw error;
  }
};

//This method is 
exports.getTicketById = async (req, res, next) => {
  try {
    const id = req.params.id;

    // get test with the given id
    const ticket = await TicketDAL.getTicketById(id);

    if (!ticket) return next(new AppError("Ticket with the given id not found"));

    res.status(200).json({
      status: "Success",
      data: ticket,
    });
  } catch (error) {
    throw error;
  }
};

exports.createNewTicket = async (req, res, next) => {
  try {
    const data = req.body;
    
    //   create new ticket
    const newTicket = await TicketDAL.createNewTicket(data);

    res.status(201).json({
      status: "new Ticket is created Successfully",
      data: newTicket,
      statusCode : "201" 
    });
  } catch (error) {
    throw error;
  }
};

//This method implements to update ticket
exports.updateTicket = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if ticket exist or not
    const ticketData = await TicketDAL.getTicketById(id);

    if (!ticketData)
      return next(new AppError("Ticket with the given id not found"));

    const ticket = await TicketDAL.updateTicket(id, updatedFields);

    res.status(200).json({
      status: `Ticket with id ${id} is Successfully updated`,
      data: ticket,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const id = req.params.id;
    // validate if ticket exist or not
    const ticketData = await TicketDAL.getTicketById(id);

    if (!ticketData) 
      return next(new AppError(`Ticket with id ${id} is Not Found`));

    await TicketDAL.deleteTicketById(id);

    res.status(200).json({
      status: `Ticket is with id ${id} is deleted Successfully`,
      statusCode : 200,
    });
  } catch (error) { 
    throw error;
  }

};
