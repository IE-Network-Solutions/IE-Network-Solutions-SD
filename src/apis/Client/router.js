const clientRouter = require("express").Router();
const ClientController = require("./controller");
const validate = require("../../../utils/validator");
const {
  createClientValidator,
  createTicketValidator,
} = require("./validation");
const authorize = require("../../middlewares/auth/authorization");
const { uploadOptions } = require("../../../utils/imageUpload");
const { uuidValidator } = require("../../../utils/uuid");

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
  .post(
    authorize,
    uploadOptions.single("user_profile"),
    validate(createClientValidator),
    ClientController.createClient
  );
clientRouter
  .route("/:id")
  .get(uuidValidator, authorize, ClientController.singleClient);
clientRouter
  .route("/:id")
  .patch(uuidValidator, authorize, ClientController.updateClient);
clientRouter
  .route("/:id")
  .delete(uuidValidator, authorize, ClientController.deleteClient);

module.exports = clientRouter;
