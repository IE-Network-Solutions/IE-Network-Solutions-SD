const AppError = require("../../../utils/apperror");
const hash = require("../../../utils/hashpassword");
const PriorityDAL = require("../priority/dal");
const ClientDAL = require("./dal");

const TypeDAL = require("../type/dal");

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
    throw error;
  }
};

exports.singleClient = async (req, res, next) => {
  try {
    const id = req.params.id;

    // get client with the given id
    const client = await ClientDAL.getClientById(id);

    if (!client)
      return next(new AppError("client with the given id not found"));

    res.status(200).json({
      status: "Success",
      data: client,
    });
  } catch (error) {
    throw error;
  }
};

exports.createClient = async (req, res, next) => {
  try {
    const data = req.body;
    const user_profile = req.file ? req.file.path : null;
    data.user_profile = user_profile;
    data.password = hash("%TGBnhy6");
    //   create new client
    const client = await ClientDAL.createClient(data);
    res.status(201).json({
      status: "Success",
      data: client,
    });
  } catch (error) {
    // throw error;
    return next(new AppError(error.message, 500));
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if client exist or not
    const clientData = await ClientDAL.getClientById(id);

    if (!clientData)
      return next(new AppError("client with the given id not found"));

    const client = await ClientDAL.updateClient(id, updatedFields);

    res.status(200).json({
      status: "Success",
      data: client,
    });
  } catch (error) {
    throw error;
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
    throw error;
  }
};

exports.clientTickets = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);
    if (user.user_type != "client") {
      return next(new AppError("Unauthorized user"));
    }

    const tickets = await ClientDAL.getClientTickets(user);
    res.status(200).json({
      status: "Success",
      data: tickets,
    });
  } catch (error) {
    throw error;
  }
};

exports.createNewTicket = async (req, res, next) => {
  try {
    const data = req.body;
    const user = req.user;

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
    const priority = await PriorityDAL.getPriority(data.priority_id);

    if (!priority) {
      return next(new AppError("such priority does not exist", 404));
    }
    data.priority = priority;

    // get client
    const client = await ClientDAL.getClientById(user.id);
    console.log(client);
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

    //   create new ticket
    const newTicket = await ClientDAL.createTicket(data);

    res.status(201).json({
      status: "new Ticket is created Successfully",
      data: newTicket,
      statusCode: "201",
    });
  } catch (error) {
    throw error;
  }
};
