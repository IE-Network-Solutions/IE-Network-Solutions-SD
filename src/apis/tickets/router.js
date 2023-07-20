const router = require("express").Router();
const TicketController = require("../tickets/controller");
const validate = require("../../../utils/validator");
const createTestValidator = require("./validation");
const uuidValidetor = require('../../../utils/uuidValidator');

router.route("/").get(TicketController.getAllTickets);
router.route("/:id").get(uuidValidetor, TicketController.getTicketById);
router.route("/").post(validate(createTestValidator), TicketController.createNewTicket);
router.route("/:id").patch(uuidValidetor, validate(createTestValidator), TicketController.updateTicket);
router.route("/:id").delete(uuidValidetor, TicketController.deleteTicket);

module.exports = router;