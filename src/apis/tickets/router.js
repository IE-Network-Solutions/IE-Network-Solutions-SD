const router = require("express").Router();
const TicketController = require("../tickets/controller");
const validate = require("../../../utils/validator");
const { createTicketValidator, assignTicket } = require("./validation");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(TicketController.getAllTickets);
router.route("/:id").get(TicketController.getTicketById);
router
  .route("/")
  .post(validate(createTicketValidator), TicketController.createNewTicket);
router
  .route("/:id")
  .patch(validate(createTicketValidator), TicketController.updateTicket);
router.route("/:id").delete(TicketController.deleteTicket);
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
