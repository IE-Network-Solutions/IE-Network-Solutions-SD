const AppError = require("../../../utils/apperror");
const hash = require("../../../utils/hashpassword");
const ClientDAL = require("./dal");


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
    data.password = hash("%TGBnhy6");    
    //   create new client
    const client = await ClientDAL.createClient(data);
    res.status(201).json({
      status: "Success",
      data: client,
    });
  } catch (error) {
    // throw error;
    return next(new AppError(error.message , 500))
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
