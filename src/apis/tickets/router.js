const router = require("express").Router();
const TicketController = require("../tickets/controller");
const validate = require("../../../utils/validator");
const {
  createTicketValidator,
  assignTicket,
  updateTicketValidator,
} = require("./validation");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(TicketController.getAllTickets);
router.route("/junk").get(TicketController.getAllJunkTickets);
router.route("/junk/:id").delete( uuidValidator, TicketController.removeDeleteTicket);


router.route("/:id").get(TicketController.getTicketById);
router.route("/").get(authorize, TicketController.getAllTickets);
router.route("/:id").get(authorize, TicketController.getTicketById);
router
  .route("/")
  .post(
    authorize,
    validate(createTicketValidator),
    TicketController.createNewTicket
  );
router
  .route("/:id")
  .patch(
    authorize,
    validate(updateTicketValidator),
    TicketController.updateTicket
  );
router.route("/:id").delete(authorize, TicketController.deleteTicket);
router
  .route("/assign-user/:id")
  .post(
    authorize,
    uuidValidator,
    validate(assignTicket),
    TicketController.assignUserToTicket
  );

router
  .route("/remove-user/:id")
  .post(authorize, uuidValidator, TicketController.removeAssigned);

module.exports = router;
