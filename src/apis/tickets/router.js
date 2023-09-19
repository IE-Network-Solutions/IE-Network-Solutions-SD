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

<<<<<<< HEAD
router.route("/").get(TicketController.getAllTickets);
router.route("/junk").get(TicketController.getAllJunkTickets);
router.route("/junk/:id").delete( uuidValidator, TicketController.removeDeleteTicket);


router.route("/:id").get(TicketController.getTicketById);
=======
router.route("/filter").get(authorize, TicketController.applyFilterOnTickets);
>>>>>>> 4367cc33b739505d65ee9aa7d4e3a3403dd3b1ea
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
router
  .route("/:id")
  .delete(uuidValidator, authorize, TicketController.deleteTicket);
router
  .route("/assign-user/:id")
  .post(
    uuidValidator,
    validate(assignTicket),
    authorize,
    TicketController.assignUserToTicket
  );

router
  .route("/remove-user/:id")
  .post(authorize, uuidValidator, TicketController.removeAssigned);

module.exports = router;
