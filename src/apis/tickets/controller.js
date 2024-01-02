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
const { sendEmailNotification } = require("../../../utils/sendNotification");
const NotificationDAL = require("../notifications/dal");
const TeamUser = require("../../models/TeamUser");
const { forEach } = require("../../../utils/permissionConstants");
const CompanyDAL = require("../Company/dal");

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

exports.getAllUnTransferedJunkTickets = async (req, res, next) => {
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

exports.transferJunkTicketToTicket = async (req, res, next) => {
  try {
    const { id } = req.params
    const junk = await TicketDAL.getJunkTicketById(id)
    if (!junk) {
      return next(new AppError("Junk Ticket to update Failed!"));
    }

    const aa = await TicketDAL.transferJunkToTicker(req.body, id, req.user.id)
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
      data: aa.updateTicket,
    });
  } catch (error) {
    throw error

  }
}

exports.deleteJunkTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
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
    const status = await StatusDAL.getStatusByType("Open");
    data.status = status;

    const admins = await UserDAL.getAllAdmins();
    // console.log(admins);

    // const to = admins[0].id;
    const from = req.user.id;
    // console.log("email", to)
    // get type
    const type = await TypeDAL.getOneType(data.type_id);
    if (!type) {
      return next(new AppError("type does not exist", 404));
    }
    data.type = type;

    if (req?.user?.role === "Admin") {
      const admin = await teamDAL.getAllTeams();
    }
    if (data.client_id) {
      // get client
      const client = await ClientDAL.getClientById(data.client_id);
      // console.log(client);
      if (!client) {
        return next(new AppError("such client does not exist", 404));
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
    NotificationDAL.createNotification({
      title: "Creating ticket",
      from: from,
      to: req.body.team_id,
      message: `Ticket created with the subject of: ${newTicket?.subject} and ticket id is ${newTicket.id}`,
      type: "user",
      isRead: false,
      created_at: new Date(),
      created_by: req.user.id
    })


    await sendEmailNotification(
      req.user.email,
      process.env.SYSTEM_EMAIL,
      admins.map(email => email.email),
      "[IE Networks Solutions] Email is sent by the employee for new Ticket",
      `Hello Admin,
      Ticket details:
      Ticket id: ${newTicket.id}
      Subject: ${newTicket.subject}
      Description: ${newTicket.description}
      Created At: ${newTicket.created_at}
      Ticket type: ${newTicket.ticket_type.type}
      Thank you!`,
      "Change password"
    );

    // when new ticket is created email will be send to the admins
    let subject = "New Ticket created";
    let body = `Please follow the ticket progress through the following link`;

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

    // if (!(user.role.roleName == "Admin")) {
    //   return next(new AppError("Unauthorized to update this ticket"));
    // }

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
    if (updatedFields.team_id) {
      const team = await teamDAL.getTeam(
        updatedFields.team_id
      );
      if (!team) {
        return next(new AppError("Department does not exist"));
      }
      updatedFields.team = team;
    }
    await TicketDAL.updateTicket(id, updatedFields);
    res.status(200).json({
      status: `Ticket with id ${id} is Successfully updated`,
      data: await TicketDAL.getTicketById(id),
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
    const userId = req.user.id;

    const ticketData = await TicketDAL.getTicketById(ticketId);

    // if (!ticketData || !ticketData.team) {
    //   return next(new AppError("Invalid Id", 500));
    // }
    const teamLeadId = ticketData?.team?.team_lead?.id;

    // if (userId != teamLeadId) {
    //   return next(new AppError("You don't have access assigne agents for this ticket", 500));
    // }
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
    userIds.map((user) => (
      NotificationDAL.createNotification({
        title: "Assign agent",
        from: req.user.id,
        to: user,
        message: ` user with id of ${user} is assigned for ${ticketId}`,
        type: "user",
        isRead: false,
        created_at: new Date(),
        created_by: req.user.id
      })
    ))



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
      singleTeam = allTickets.filter(ticket => ticket?.team?.id === list.team_id);
      singleTeam.map((team) => {
        listOfTicketTeam.push(team);
      })
    }

    const groupedTeam = listOfTicketTeam.reduce((groupedTeam, singleTeam) => {
      const teamName = singleTeam.team ? singleTeam.team.name : "Unassigned";
      const existingTeam = groupedTeam.find(item => item.teamName === teamName);
      if (existingTeam) {
        existingTeam.tickets.push(singleTeam);
      } else {
        groupedTeam.push({ teamName: teamName, tickets: [singleTeam] });
      }
      return groupedTeam;
    }, []);

    const ticketsForCurrentLoggedInUser = allTickets.filter(ticket => ticket?.created_by?.id === currentLoggedInUser.id);

    let unAssignedTickets;
    if (currentLoggedInUser.role.roleName === "Admin"
      || currentLoggedInUser.role.roleName === "Manager"
      || currentLoggedInUser.role.roleName === "Director"
      || currentLoggedInUser.role.roleName === "CEO"
    ) {
      unAssignedTickets = allTickets.filter(ticket => ticket?.team === null);
    }

    if (currentLoggedInUser.role.roleName === "team-lead") {
      unAssignedTickets = allTickets.filter(ticket => ticket.assigned_users.length === 0);
    }
    res.status(200).json({
      status: 'Success',
      userTicket: ticketsForCurrentLoggedInUser,
      listOfTicketsByAgent: listOfTicketsByAgent,
      groupedTeam: groupedTeam,
      unAssignedTickets: unAssignedTickets
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

exports.getAgentStatusForTeamById = async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const currentLoggedInUser = req.user.role.roleName;

    if (currentLoggedInUser !== "team-lead") {
      return res.status(400).json({ status: "Error", message: "Unable to see agent status" });
    }

    const teamUser = await TicketDAL.getAgentStatusForTeamById(teamId);
    const userIds = teamUser.map((user) => user.user_id);

    let allUserTickets = []

    for (const user of userIds) {
      const result = await TicketDAL.getTicketUserByUserId(user);
      allUserTickets.push(result);
    }
    let returnedData = allUserTickets.map(users => {
      let userCount = { total: users.length }

      if (users.length) {
        userCount["userDetail"] = users[0].user
        users.forEach((us) => {

          if (Object.keys(userCount).includes(us.ticket.ticket_status?.type)) {
            userCount[us.ticket.ticket_status?.type] += 1
          }
          else {
            userCount[us.ticket.ticket_status?.type] = 1
          }
        })
      }
      return userCount
    });

    res.status(200).json({
      status: "Success",
      userTicket: returnedData
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
}

exports.getAllAgentStatus = async (req, res, next) => {
  try {
    const teamUser = await TicketDAL.getAllAgentStatus();
    const teamsId = teamUser.map((team) => team.team_id);

    let allTeamTickets = [];
    let singleTeam = [];
    for (const teamId of teamsId) {
      singleTeam = await TicketDAL.getTeamTicketByTeamId(teamId);
      singleTeam.map((team) => {
        allTeamTickets.push(team);
      })
    }

    const groupedTeam = allTeamTickets.reduce((groupedTeam, singleTeam) => {
      const teamName = singleTeam.team ? singleTeam.team.name : "Unassigned";
      const existingTeam = groupedTeam.find(item => item.teamName === teamName);
      if (existingTeam) {
        existingTeam.tickets.push(singleTeam);
      } else {
        groupedTeam.push({ teamName: teamName, tickets: [singleTeam] });
      }
      return groupedTeam;
    }, []);

    let returnedData = groupedTeam.map(team => {
      let ticketcount = { total: team.tickets.length }

      if (team.tickets.length) {
        ticketcount["teamName"] = team.teamName
        ticketcount["tickets"] = team.tickets
        team.tickets.forEach((us) => {

          if (Object.keys(ticketcount).includes(us.ticket_status?.type)) {
            ticketcount[us.ticket_status?.type] += 1
          }
          else {
            ticketcount[us.ticket_status?.type] = 1
          }
        })
      }
      return ticketcount
    });

    res.status(200).json({
      status: "Success",
      data: returnedData
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
}

exports.getAllTicketsForCompany = async (req, res) => {
  try {

    // console.log(req.user.id);
    // const data = await TicketDAL.getAllTicketsForCompany(userId)

    res.status(200).json({
      status: "Success",
      // data: req.user.id,
    });
  } catch (error) {
    throw error;
  }
}

exports.getAllEscalates = async (req, res) => {
  try {
    const escalateStatus = await StatusDAL.getStatusByType("Escalet"); // Get the escalate status object
    const allTickets = await TicketDAL.getAllTickets(); // Get all tickets from the database

    // Filter tickets based on the escalate status ID
    const allEscalates = allTickets.filter(ticket => ticket?.ticket_status?.id === escalateStatus.id);

    res.status(200).json({
      status: "Success",
      data: allEscalates
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal server error"
    });
  }
};

exports.viewTicketdetailByAdminById = async (req, res) => {
  try {
    const ticket = await TicketDAL.getTicketById(req.params.id);
    res.status(200).json({
      status: "Success",
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal server error"
    });
  }
};

exports.closeTicket = async (req, res, next) => {
  try {
    const status = await StatusDAL.getStatusByType("Closed");
    await TicketDAL.closeTicket(req.params.id, status.id);
    const user = await TicketDAL.getTicketById(req.params.id);

    await sendEmail(
      req.user.email,
      user.client.email,
      "Ticket Notification",
      "Dear client, Your ticket is closed successfully",
      "cc"
    )
    res.status(200).json({
      status: "Success",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Internal server error"
    });
  }
};

exports.closeTicketRequest = async (req, res, next) => {
  const admins = await UserDAL.getAllAdmins();
  const ticket = await TicketDAL.getTicketById(req.params.id);
  console.log(ticket)
  if (!ticket) {
    return next(new AppError("Ticket Not Found", 404))
  }

  await TicketDAL.updateIsCloseTicketRequested(req.params.id,true )
  admins?.map(async (admin) => {
    const singleAdmin = await UserDAL.getOneUser(admin?.id);
    admins?.map(async (admin) => {
      const singleAdmin = await UserDAL.getOneUser(admin.id);
      await NotificationDAL.createNotification({
        title: "Close ticket Request",
        from: req.user.id,
        to: singleAdmin?.email,
        message: `Dear, Please close my ticket}`,
        type: "user",
        isRead: false,
        created_at: new Date(),
        created_by: req.user.id
      })
    })

    await sendEmail(
      req?.user?.email,
      singleAdmin?.email,
      "Ticket Notification",
      "Dear, Please close my ticket",
      "cc"
    )
  })

  res.status(200).json({
    status: "success",
    data: await TicketDAL.getTicketById(req.params.id),
  })
}
exports.clientRating = async (req, res, next) => {
  const healthScore = req.body.healthScore;
  const ticket = await TicketDAL.getTicketById(req.params.id);
  if (!ticket) {
    return next(new AppError("Ticket Not Found", 404))
  }
  let rating = 0;
  if (healthScore == 5) {
    rating = 5;
  }
  if (healthScore == 4) {
    rating = 4;
  }
  if (healthScore == 3) {
    rating = 3;
  }
  if (healthScore == 2) {
    rating = 2;
  }
  if (healthScore == 1) {
    rating = 1
  }
  await TicketDAL.createRate(req.params.id, parseInt(rating));

  res.status(200).json({
    status: "success",
    data: await TicketDAL.getTicketById(req.params.id),
  })
}

exports.updateTicketPriority = async (req, res, next) => {
  const ticket = await TicketDAL.getTicketById(req.params.id);

  if (!ticket) {
    return next(new AppError("Ticket with given id does NOT exist", 404));
  }

  const priority = await PriorityDAL.getPriority(req.body?.priority_id);
  if (!priority) {
    return next(new AppError("Priority does not exist"));
  }

  await TicketDAL.updateTicketPriority(ticket.id, priority);
  res.status(200).json({
    status: "Success",
    data: await TicketDAL.getTicketById(ticket.id)
  })
}
