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
router
      .route("/junk")
      .get(TicketController.getAllJunkTickets)
router
      .route('/junk/untransfered')
      .get(TicketController.getAllUnTransferedJunkTickets)

router
    .route('/junk/:id')
    .get(TicketController.getJunkTicket)
    .post(TicketController.transferJunkTicketToTicket)
    .delete( uuidValidator, TicketController.deleteJunkTicket);


router.route("/:id").get(TicketController.getTicketById);
router.route("/filter").get(authorize, TicketController.applyFilterOnTickets);
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
