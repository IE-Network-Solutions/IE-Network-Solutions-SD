const AppError = require("../../../utils/apperror");
const TicketDAL = require("./dal");
const TestDAL = require("../../apis/test/dal");
const UserDAL = require("../users/dal");
const validateUuid = require("uuid-validate");
const TypeDAL = require("../type/dal");
const PriorityDAL = require("../priority/dal");
const StatusDAL = require("../status/dal");
const DepartmentDAL = require("../department/dal");
const ClientDAL = require("../Client/dal");

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
      return next(new AppError("No Ticket data found", 404));
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
      data: [ticket],
    });
  } catch (error) {
    throw error;
  }
};

exports.createNewTicket = async (req, res, next) => {
  try {
    const data = req.body;
    const user = req.user;

    // get status
    const status = await StatusDAL.getStatus(data.status_id);
    if (!status) {
      return next(new AppError("status does not exist", 404));
    }
    data.status = status;

    // get type
    const type = await TypeDAL.getOneType(data.type_id);
    if (!type) {
      return next(new AppError("type does not exist", 404));
    }
    data.type = type;

    // get department
    const department = await DepartmentDAL.getDepartment(data.department_id);
    if (!department) {
      throw next(new Error("department does not exist", 404));
    }
    data.department = department;

    // get priority
    const priority = await PriorityDAL.getPriority(data.priority_id);

    if (!priority) {
      return next(new AppError("such priority does not exist", 404));
    }
    data.priority = priority;

    if (data.client_id) {
      // get client
      const client = await ClientDAL.getClientById(data.client_id);
      console.log(client);
      if (!client) {
        return next(new AppError("such client does not exist", 404));
      }

      if (client.user_type == "client") {
      }
      if (client.user_type !== "client") {
        return next(new AppError("client should be type client", 500));
      }
      data.client = client;

      // check client company
      if (!client.company) {
        return next(
          new AppError(
            "the specified client is not in any of the companies",
            500
          )
        );
      }
      data.company = client.company;
    } else {
      data.client = user;
    }
    //   create new ticket
    const newTicket = await TicketDAL.createNewTicket(data);

    res.status(201).json({
      status: "new Ticket is created Successfully",
      data: newTicket,
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

    // check if type exsit or not
    if (updatedFields.type_id) {
      const type = await TypeDAL.getOneType(updatedFields.type_id);
      if (!type) {
        return next(new AppError("type not found", 404));
      }
      updatedFields.type = type;
    }

    // check if priority exist or not
    if (updatedFields.priority_id) {
      const priority = await PriorityDAL.getPriority(updatedFields.priority_id);
      if (!priority) {
        return next(new AppError("Priority not found", 404));
      }
      updatedFields.priority = priority;
    }

    // check if status exist or not
    if (updatedFields.status_id) {
      const status = await StatusDAL.getStatus(updatedFields.status_id);
      if (!status) {
        return next(new AppError("Status does not exist"));
      }
      updatedFields.status = status;
    }

    // check if department exist or not
    if (updatedFields.department_id) {
      const department = await DepartmentDAL.getDepartment(
        updatedFields.department_id
      );
      if (!department) {
        return next(new AppError("Department does not exist"));
      }
      updatedFields.department = department;
    }

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
