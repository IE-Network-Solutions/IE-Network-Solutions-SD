const AppError = require("../../../utils/apperror");
const hash = require("../../../utils/hashpassword");
const { uuidValidator } = require("../../../utils/uuid");
const PriorityDAL = require("../priority/dal");
const ClientDAL = require("./dal");

const TypeDAL = require("../type/dal");
const CompanyDAL = require("../Company/dal");
const teamDAL = require("../team/dal");
const generateRandomPassword = require("../../../utils/generateRandomPassword");
const UserDAL = require("../users/dal");
const { sendEmailNotification } = require("../../../utils/sendNotification");
const NotificationDAL = require("../notifications/dal");
const { generateVerificationCode } = require("../../../utils/generateVerificationCode");
const sendEmail = require("../../../utils/sendEmail");
const StatusDAL = require("../status/dal");
const TicketDAL = require("../tickets/dal");

exports.allClients = async (req, res, next) => {
  try {
    //   get all clients
    const clients = await ClientDAL.getClient();

    // check if clients data exist
    if (!clients) {
      // return custom error
      return next(new AppError("No client data found"));
    }

    // response
    res.status(200).json({
      status: "Success",
      data: clients,
    });
  } catch (error) {
    return next(new AppError("client with the given id not found"));
  }
};

exports.singleClient = async (req, res, next) => {
  try {
    const id = req.params.id;

    // get client with the given id
    const client = await ClientDAL.getClientById(id);
    // console.log( "client CLient",client)

    if (!client)
      return next(new AppError("client with the given id not found"));

    res.status(200).json({
      status: "Success",
      data: client,
    });
  } catch (error) {
    return res.status(500).json(next(new AppError(error, 500)))

  }
};

exports.createClient = async (req, res, next) => {
  try {
    const data = req.body;
    const profile_pic = req.file ? req.file.path : null;
    data.profile_pic = profile_pic;

    data.password = hash(generateRandomPassword(8, true, true, true));
    data.created_by = req.user.id;
    const client = await ClientDAL.createClient(data);
    await UserDAL.sendChangePasswordAlertByEmail("client", req.body.email);
    res.status(201).json({
      status: "Success",
      data: client,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json(next(new AppError(error, 500)))
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;
    const client = await ClientDAL.getClientById(id);

    if (!client)
      return next(new AppError("client with the given id not found"));

    const profile_pic = req.file && req.file.path ? req.file.path : null;
    updatedFields.profile_pic = profile_pic;

    if (updatedFields.password) {
      updatedFields.password = hash(updatedFields.password);
      updatedFields.password_changed = true;
    }
    // check if company is on the update
    if (updatedFields.companyId) {
      const company = await CompanyDAL.getCompanyById(updatedFields.companyId);
      if (!company) {
        return next(new AppError("company with the given id not found"));
      }
      updatedFields.companyId = company;
    }
    await ClientDAL.updateClient(id, updatedFields);
    res.status(200).json({
      status: "Success",
      data: client,
    });
  } catch (error) {
    return res.status(500).json(next(new AppError(error, 500)))
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    const id = req.params.id;

    // validate if client exist or not
    const clientData = await ClientDAL.getClientById(id);

    if (!clientData)
      return next(new AppError("client with the given id not found"));

    await ClientDAL.deleteClient(id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    return res.status(500).json(next(new AppError(error, 500)))
  }
};

exports.clientTickets = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.user_type !== "client") {
      return next(new AppError("Unauthorized user"));
    }
    const tickets = await ClientDAL.getClientTickets(user);
    // Separate tickets based on status
    const openTickets = tickets.filter(ticket => ticket?.ticket_status?.type === "Open");
    const pendingTickets = tickets.filter(ticket => ticket?.ticket_status?.type === "Pending");
    const closedTickets = tickets.filter(ticket => ticket?.ticket_status?.type === "Closed");
    const escalateTickets = tickets.filter(ticket => ticket?.ticket_status?.type === "Escalet");
    const assignedTickets = tickets.filter(ticket => ticket?.assigned_users?.length != 0);
    const unAssignedTickets = tickets.filter(ticket => ticket?.assigned_users?.length === 0);

    res.status(200).json({
      status: "Success",
      data: {
        openTickets,
        pendingTickets,
        closedTickets,
        escalateTickets,
        assignedTickets,
        unAssignedTickets
      },
    });
  } catch (error) {
    return res.status(500).json(next(new AppError(error, 500)));
  }
};

exports.createNewTicket = async (req, res, next) => {
  try {
    const data = req.body;
    const user = req.user;

    const admins = await UserDAL.getAllAdmins();

    const to = admins[0].id;
    const from = req.user.id;
    if (user.user_type != "client") {
      return next(new AppError("unauthorized user", 500));
    }

    // get type
    const type = await TypeDAL.getOneType(data.type_id);
    if (!type) {
      return next(new AppError("type does not exist", 404));
    }
    data.type = type;

    // get priority
    // const priority = await PriorityDAL.getPriority(data.priority_id);

    // if (!priority) {
    //   return next(new AppError("such priority does not exist", 404));
    // }
    // data.priority = priority;

    // get client
    const client = await ClientDAL.getClientById(user.id);
    if (!client) {
      return next(new AppError("such client does not exist", 404));
    }

    if (client.user_type !== "client") {
      return next(new AppError("client should be type client", 404));
    }
    data.client = client;

    // check client company
    if (!client.company) {
      return next(
        new AppError("the specified client is not in any of the companies", 500)
      );
    }

    data.company = client.company;
    const status = await StatusDAL.getStatusByType("Open");
    data.status = status;

    //   create new ticket
    const newTicket = await ClientDAL.createTicket(data);
    console.log("admin id : ", req.user.id)
    admins.map((admin) => (
      NotificationDAL.createNotification({
        title: "Creating ticket",
        from: from,
        to: admin.id,
        message: `Ticket created with the subject of: ${newTicket?.subject} and ticket id is ${newTicket.id}`,
        type: "user",
        isRead: false,
        created_at: new Date(),
        created_by: req.user.id
      }
      )
    )),


      await sendEmailNotification(
        req.user.email,
        process.env.SYSTEM_EMAIL,
        "[IE Networks Solutions] Email is sent by the client for new Ticket",
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
    res.status(201).json({
      status: "new Ticket is created Successfully",
      data: newTicket,
      statusCode: "201",
    });
  } catch (error) {
    //  new AppError(error ,500)
    return res.status(500).json(next(new AppError(error, 500)))
  }
};

exports.getAllClientTicketsByAdmin = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role.roleName == "Admin") {
      const clientTickets = await ClientDAL.getAllClientTicketsByAdmin();
      const result = clientTickets.filter(ticket => ticket.team == null);
      res.status(200).json({
        status: "Success",
        data: result,
      });
    }
    return next(new AppError("You don't have access to view client tickets"));

  } catch (error) {
    // return res.status(500).json(next(new AppError(error, 500)))
  }
};

exports.getClientTicketById = async (req, res, next) => {
  const result = await ClientDAL.getClientTicketById(req.params.id);
  if (!result) {
    return next(new AppError("Id Not Found"));
  }
  res.status(200).json({
    message: "Success",
    data: result
  })
}
exports.assignClientTicketToTeamByAdmin = async (req, res, next) => {
  try {
    const roleName = req.user.role;
    const teamsId = req.body.teams;
    const ticketId = req.params.id;


    const currentLoggedInUser = req.user;
    const allAdmin = await UserDAL.getAllAdmins();
    const currentLoggedInAdmin = allAdmin.filter(admin => admin?.id === currentLoggedInUser.id);


    if (roleName.roleName != "Admin") {
      return next(new AppError("You have not a role to assign client ticket to team", 400))
    }
    const ticketResult = await ClientDAL.getClientTicketById(ticketId);
    if (!ticketResult) {
      return next(new AppError("Ticket Not Found", 400))
    }

    teamsId.map(async (teamId) => {
      const result = await teamDAL.getTeam(teamId)
      if (!result) {
        return next(new AppError("Team Not Found", 400))
      }
    })
    const result = await ClientDAL.assignClientTicketToTeamByAdmin(ticketId, teamsId)
    teamsId.map((team) => (
      NotificationDAL.createNotification({
        title: "Assign client to team",
        from: currentLoggedInUser.id,
        to: team,
        message: `Ticket is assigned by admin to : ${team} and team id is ${team}`,
        type: "user",
        isRead: false,
        created_at: new Date(),
        created_by: req.user.id
      }

      )

    )),
      // await NotificationDAL.createNotification({
      //   title: "Assign client ticket to team by admin",
      //   from: currentLoggedInAdmin.email,
      //   to: teamsId,
      //   message: "This notification is created from admin when the admin assign client ticket to team",
      //   type: "user",
      //   isRead: false,
      //   created_at: new Date(),
      //   created_by: req.user.id
      // }
      // )
      res.status(200).json({
        message: "Success",
        data: result
      })

  } catch (error) {
    return res.status(500).json(next(new AppError(error, 500)))
  }
};

exports.sendActivationCode = async (req, res, next) => {
  try {
    const user = await UserDAL.getOneUser(req.params.id);
    const code = await UserDAL.sendChangePasswordAlertByEmail("client", user?.email)
    res.status(200).json({
      status: "Success",
      data: code
    })
  } catch (error) {
    return res.status(500).json(next(new AppError(error, 500)))
  }
};

