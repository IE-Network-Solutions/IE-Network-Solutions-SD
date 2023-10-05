const clientRouter = require("express").Router();
const ClientController = require("./controller");
const validate = require("../../../utils/validator");
const UU = require("../../../utils/UU");
// const  uuidValidator  = require("../../../utils/uuid");
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
  .patch(
    uuidValidator,
    uploadOptions.single("user_profile"),
    authorize,
    ClientController.updateClient
  );
clientRouter
  .route("/:id")
  .delete(uuidValidator, authorize, ClientController.deleteClient);

clientRouter.route("/tickets/getAllClientTicketsByAdmin").
  get(authorize, ClientController.getAllClientTicketsByAdmin);

clientRouter.route("/tickets/getClientTicketById/:id").
  get(authorize, ClientController.getClientTicketById);

clientRouter.route("/tickets/assignClientTicketToTeamByAdmin/:id").
  post(authorize, ClientController.assignClientTicketToTeamByAdmin);

module.exports = clientRouter;
