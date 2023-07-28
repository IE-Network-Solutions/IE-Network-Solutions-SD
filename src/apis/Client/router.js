const clientRouter = require("express").Router();
const ClientController = require("./controller");
const validate = require("../../../utils/validator");
const {
  createClientValidator,
  createTicketValidator,
} = require("./validation");
const authorize = require("../../middlewares/auth/authorization");

clientRouter.route("/").get(ClientController.allClients);
clientRouter.route("/tickets").get(authorize, ClientController.clientTickets);
clientRouter
  .route("/tickets")
  .post(
    authorize,
    validate(createTicketValidator),
    ClientController.createNewTicket
  );

clientRouter
  .route("/")
  .post(validate(createClientValidator), ClientController.createClient);
clientRouter.route("/:id").get(ClientController.singleClient);
clientRouter.route("/:id").patch(ClientController.updateClient);
clientRouter.route("/:id").delete(ClientController.deleteClient);

module.exports = clientRouter;
