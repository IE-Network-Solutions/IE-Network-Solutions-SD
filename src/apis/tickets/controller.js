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
const sendEmail = require("../../../utils/sendEmail");
const teamDAL = require("../team/dal");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns  This method implements to get all tickets
 */
exports.getAllTickets = async (req, res, next) => {
  try {
    const user = req.user;

    //   get all tickets
    const userData = await TicketDAL.getTicketBasedOnTeamAccess(user.id);

    // check if tickets are exist
    if (!userData) {
      // return custom error
      return next(new AppError("userData does not exist", 404));
    }

    const userTeams = userData.teams_access;
    const userTickets = userTeams.reduce(
      (tickets, team) => tickets.concat(team.tickets),
      []
    );

    // return all tickets of a user  based on thier ticket access
    res.status(200).json({
      status: "Success",
      data: userTickets,
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllJunkTickets = async (req, res, next) => {
  try {
    //   get all tickets
    const ticket = await TicketDAL.getAllJunkTickets();

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
exports.getJunkTicket = async (req, res, next) => {
  try {
    //   get all tickets
    const ticket = await TicketDAL.getJunkTicketById(req.params.id);

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
exports.getAllUnTransferedJunkTickets=async (req, res, next) => {
  try {
    //   get all tickets
    const ticket = await TicketDAL.getAllUnTransferedJunkTickets();

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

exports.transferJunkTicketToTicket=async(req,res,next)=>{
  try {
    const {id}= req.params
    const junk = await TicketDAL.getJunkTicketById(id)
    if(!junk){
      return next(new AppError("Junk Ticket to update Failed!"));
    }

    const aa = await TicketDAL.transferJunkToTicker(req.body , id ,req.user.id)
    // if(!transfer){
    //   return next(new AppError("Failed to Transfer junk ticket to ticket, try agian!"));
    // }
  //  const email = await sendEmail("form" , "to" , "dskf" , "kdsfj" , "dkjf" , "dklfj")
    // console.log("email",req.body);
    // console.log(
    //   "Transfered", transfer,
    //   "Updated Data",
    //   updatedJunk);

    res.status(200).json({
      status: "Success",
      data: aa,
    });
  } catch (error) {
    throw error
    
  }
}


exports.deleteJunkTicket= async( req, res , next)=>{
  try {
    const {id} = req.params;
    // validate if ticket exist or not
    const ticketData = await TicketDAL.getJunkTicketById(id);

    if (!ticketData)
      return next(new AppError(`Junk Ticket with id ${id} is Not Found`));

    await TicketDAL.deleteJunkTicket(id);

    res.status(200).json({
      status: `Junk Ticket with id ${id} is deleted Successfully`,
      statusCode: 200,
    });
  } catch (error) {
    throw error
  }
}
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
    const created_by = req.user;
    data.created_by = created_by;

    const admins = await UserDAL.getAllAdmins();
    console.log(admins);

    const to = admins.map((admin) => admin.email);
    const from = req.user.email;

    console.log(to);
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
    const team = await teamDAL.getTeam(data.team_id);
    if (!team) {
      throw next(new Error("team does not exist", 404));
    }
    data.team = team;

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
      data.client = created_by;
    }
    //   create new ticket
    const newTicket = await TicketDAL.createNewTicket(data);

    // when new ticket is created email will be send to the admins
    let subject = "New Ticket created";
    let body = `Please follow the ticket progress through the following link`;
    const sendmail = await sendEmail(
      from,
      to,
      subject,
      newTicket.description,
      to
    );

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
    const user = req.user;
    // check if the user updating is the one who created or the admin
    if (!(user.id == user.created_by) || !(user.role.roleName == "Admin")) {
      return next(new AppError("Unauthorized to update this ticket"));
    }

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

exports.applyFilterOnTickets = async (req, res, next) => {
  try {
    const data = req.query;
    const filterData = {};
    // check and assign the priority
    if (data.priority) {
      const priority = await PriorityDAL.getPriority(data.priority);
      if (!priority) {
        return next(new AppError("no such priority", 404));
      }
      filterData.ticket_priority = priority.id;
    }

    // check and assign the status
    if (data.status) {
      const status = await StatusDAL.getStatus(data.status);
      if (!status) {
        return next(new AppError("no such status", 404));
      }
      filterData.ticket_status = status.id;
    }

    // check and assign the type
    if (data.type) {
      const type = await TypeDAL.getOneType(data.type);
      if (!type) {
        return next(new AppError("no such ticket type", 404));
      }
      filterData.ticket_type = type.id;
    }

    // check and assign the status
    if (data.department) {
      const department = await DepartmentDAL.getDepartment(data.department);
      if (!department) {
        return next(new AppError("no such department", 404));
      }
      filterData.department = department.id;
    }

    const tickets = await TicketDAL.filterTicket(filterData);

    res.status(200).json({
      status: "Success",
      data: tickets,
    });
  } catch (error) {
    throw error;
  }
};

exports.getAllTicketsForCurrentLoggedInUser = async (req, res, next) => {
  try {
    const currentLoggedInUser = req.user;
    const allTickets = await TicketDAL.getAllTickets();
    const userTeam = await teamDAL.getTeamByUserId(currentLoggedInUser.id)
    const ticketsByAgent = await TicketDAL.getAllTicketsCreatedByAgentByUserId(currentLoggedInUser.id);

    let listOfTicketsByAgent = [];
    for (const list of ticketsByAgent) {
      const singleTicket = await TicketDAL.getTicketById(list.ticket_id)
      listOfTicketsByAgent.push(singleTicket);
    }

    let listOfTicketTeam = [];
    let singleTeam = [];
    for (const list of userTeam) {
      singleTeam = allTickets.filter(ticket => ticket.team.id === list.team_id);
      singleTeam.map((team) => {
        listOfTicketTeam.push(team);
      })
    }

    const groupedTeam = listOfTicketTeam.reduce((groupedTeam, team) => {
      const teamName = team.team ? team.team.name : "Unassigned";
      if (!groupedTeam[teamName]) {
        groupedTeam[teamName] = [];
      }
      groupedTeam[teamName].push(team);
      return groupedTeam;
    }, {});
    const ticketsForCurrentLoggedInUser = allTickets.filter(ticket => ticket.created_by.id === currentLoggedInUser.id);

    res.status(200).json({
      status: 'Success',
      userTicket: ticketsForCurrentLoggedInUser,
      listOfTicketsByAgent: listOfTicketsByAgent,
      groupedTeam: groupedTeam
    // Filter tickets where the createdBy field's id matches the current user's id.
    });
  } catch (error) {
    next(error);
  }
};

exports.groupAllTicketsByTeamAndGet = async (req, res, next) => {
  try {
    const currentLoggedInUser = req.user;
    const groupedTickets = await TicketDAL.groupAllTicketsByTeam();

    const result = groupedTickets.reduce((result, ticket) => {
      const teamName = ticket.team ? ticket.team.name : "Unassigned"; // Use "Unassigned" for tickets without a team
      if (!result[teamName]) {
        result[teamName] = [];
      }
      result[teamName].push(ticket);
      return result;
    }, {});

    // if (currentLoggedInUser.user_type != "Admin") {
    //   return next(new AppError("Current user Unable to View"));
    // }

    // Now 'groupedTickets' will contain tickets grouped by team name or "Unassigned" if not associated with any team
    res.status(200).json({
      status: "Success",
      currentLoggedInUser: currentLoggedInUser,
      groupedTickets: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTicketsByStatus = async (req, res, next) => {
  try {
    const data = await TicketDAL.ticketsTotalByStatus();

    res.status(200).json({
      status: "Success",
      data: data,
    });
  } catch (error) {
    throw error;
  }
};

exports.getTicketsCountByTeam = async (req, res, next) => {
  try {
    const data = await TicketDAL.getAllTeamTicketsCount();

    res.status(200).json({
      status: "Success",
      data: data,
    });
  } catch (error) {
    throw error;
  }
};

exports.getAssignedTicketsForLoggedinUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await TicketDAL.getAssignedTickets(userId);

    res.status(200).json({
      status: "Success",
      data: data,
    });
  } catch (error) {
    throw error;
  }
};
