const router = require("express").Router();
const TicketController = require("../tickets/controller");
const validate = require("../../../utils/validator");
const createTestValidator = require("./validation");

router.route("/").get(TicketController.getAllTickets);
router.route("/:id").get(TicketController.getTicketById);
router.route("/").post(validate(createTestValidator), TicketController.createNewTicket);
router.route("/:id").patch(validate(createTestValidator), TicketController.updateTicket);
router.route("/:id").delete(TicketController.deleteTicket);

module.exports = router;