const AppError = require("../../../utils/apperror");
const TicketDAL = require("./dal");
const TestDAL = require("../../apis/test/dal");
const UserDAL = require("../users/dal");
const validateUuid = require("uuid-validate");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns  This method implements to get all tickets
 */
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

    if (!ticket)
      return next(new AppError("Ticket with the given id not found"));

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
      statusCode: "201",
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
      statusCode: 200,
    });
  } catch (error) {
    throw error;
  }
};

exports.assignUserToTicket = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const userIds = req.body.users;

    //   validate uuid
    userIds.map((uuid) => {
      if (!validateUuid(uuid)) {
        return next(new AppError("Invalid Id", 500));
      }
    });

    // check users
    const users = await UserDAL.findMultipleUsers(userIds);
    if (!users) return next(new AppError("user exsistance error", 404));

    // check ticket
    const ticket = await TicketDAL.getTicketById(ticketId);
    if (!ticket) return next("ticket does not exist", 404);

    // assign users
    const ticketUsers = await TicketDAL.assignUsersToTicket(ticketId, userIds);

    res.status(200).json({
      status: "Success",
      data: ticketUsers,
    });
  } catch (error) {
    throw error;
  }
};

exports.removeAssigned = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const use_id = req.body.users;

    // check user
    const user = await UserDAL.getOneUser(use_id);
    if (!user) return next(new AppError("user does not", 404));

    // check ticket
    const ticket = await TicketDAL.getTicketById(ticketId);
    if (!ticket) return next("ticket does not exist", 404);

    // remove users
    const ticketUsers = await TicketDAL.removeAssignedUser(ticketId, use_id);

    res.status(200).json({
      status: "Success",
      data: ticketUsers,
    });
  } catch (error) {
    throw error;
  }
};
