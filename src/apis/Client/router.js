const clientRouter = require("express").Router();
const ClientController = require("./controller");
const validate = require("../../../utils/validator");
const createClientValidator = require("./validation");
const UU = require("../../../utils/UU");
// const  uuidValidator  = require("../../../utils/uuid");

clientRouter.route("/").get(ClientController.allClients);

clientRouter
  .route("/")
  .post( validate(createClientValidator) , ClientController.createClient);
  clientRouter.route("/:id").get( UU,ClientController.singleClient);
  clientRouter.route("/:id").patch(ClientController.updateClient);
clientRouter.route("/:id").delete(ClientController.deleteClient);

module.exports = clientRouter;

