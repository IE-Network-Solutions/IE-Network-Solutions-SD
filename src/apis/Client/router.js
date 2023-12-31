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
const permissionMiddleware = require("../../middlewares/permission.middleware");

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
    permissionMiddleware(['create-contact']),
    uploadOptions.single("profile_pic"),
    validate(createClientValidator),
    ClientController.createClient
  );
clientRouter
  .route("/:id")
  .get(uuidValidator, authorize,
    permissionMiddleware(['view-client']), ClientController.singleClient);
clientRouter
  .route("/:id")
  .patch(
    uuidValidator,
    uploadOptions.single("profile_pic"),
    authorize,
    permissionMiddleware(['update-client']),
    ClientController.updateClient
  );
clientRouter
  .route("/:id")
  .delete(authorize, permissionMiddleware(['delete-client']), uuidValidator, ClientController.deleteClient);

clientRouter.route("/tickets/getAllClientTicketsByAdmin").
  get(authorize, ClientController.getAllClientTicketsByAdmin);

clientRouter.route("/tickets/getClientTicketById/:id").
  get(authorize, ClientController.getClientTicketById);

clientRouter.route("/tickets/assignClientTicketToTeamByAdmin/:id").
  patch(authorize, ClientController.assignClientTicketToTeamByAdmin);

clientRouter.route("/tickets/:id").
  post(authorize, ClientController.assignClientTicketToTeamByAdmin);

clientRouter.route("/tickets/send-activation-code/by-admin/:id").
  post(authorize, ClientController.sendActivationCode);

module.exports = clientRouter;
