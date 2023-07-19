const AppError = require("../../../utils/apperror");
const ClientDAL = require("./dal");
const clientDAL = require("./dal");

exports.allClients = async (req, res, next) => {
  try {
    //   get all clients
    const clients = await clientDAL.getClient();

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
    const client = await clientDAL.getClientById(id);

    if (!client) return next(new AppError("client with the given id not found"));

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

    // Check required fields
    if (!data.first_name ||!data.last_name  || !data.email || !data.role || !data.department || !data.user_type ) {
      return next(new AppError("Please fill all required fields", 400));
    }

    //   create new client
    const client = await ClientDAL.createClient(data);

    res.status(201).json({
      status: "Success",
      data: client,
    });
  } catch (error) {
    throw error;
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if client exist or not
    const clientData = await clientDAL.getClientById(id);

    if (!clientData)
      return next(new AppError("client with the given id not found"));

    const client = await clientDAL.updateClient(id, updatedFields);

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
    const clientData = await clientDAL.getClientById(id);

    if (!clientData)
      return next(new AppError("client with the given id not found"));

    await clientDAL.deleteclient(id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};
