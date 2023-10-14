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
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/filter").get(authorize, TicketController.applyFilterOnTickets);

router
  .route("/junk")
  .get(TicketController.getAllJunkTickets)
router
  .route('/junk/untransfered')
  .get(TicketController.getAllUnTransferedJunkTickets)

router
  .route('/junk/:id')
  .get(TicketController.getJunkTicket)
  .post( authorize,TicketController.transferJunkTicketToTicket)
  .delete(uuidValidator, TicketController.deleteJunkTicket);


router
  .route("/user-assigned-ticket")
  .get(authorize, TicketController.getAssignedTicketsForLoggedinUser)
router.route("/tickt-status").get(authorize, TicketController.getTicketsByStatus);
router.route("/tickt-team-count").get(authorize, TicketController.getTicketsCountByTeam);
router.route("/").get(authorize, TicketController.getAllTickets);
router.route("/:id").get(authorize, TicketController.getTicketById);
router
  .route("/")
  .post(
    authorize,
    permissionMiddleware(["create-ticket"]),
    validate(createTicketValidator),
    TicketController.createNewTicket
  );
router
  .route("/:id")
  .patch(
    authorize, validate(updateTicketValidator), TicketController.updateTicket);
router
  .route("/:id")
  .delete(authorize, uuidValidator, authorize, TicketController.deleteTicket);
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

router
  .route("/getAllTickets/ForCurrentLoggedInUser")
  .get(authorize, TicketController.getAllTicketsForCurrentLoggedInUser);

router
  .route("/getAllTickets/groupByTeam")
  .get(authorize, TicketController.groupAllTicketsByTeamAndGet);

router.route("/getAllTickets/ForCurrentLoggedInUser").get(
  authorize,
  permissionMiddleware(["view-ticket-for-logged-in"]),
  TicketController.getAllTicketsForCurrentLoggedInUser
);

router
  .route("/getAllTickets/groupByTeam")
  .get(
    authorize,
    permissionMiddleware(["view-grouped-ticket-by-team"]),
    TicketController.groupAllTicketsByTeamAndGet
  );
  router
    .route('/companyticket')
    .get(
      authorize,
      TicketController.getAllTicketsForCompany
    )

module.exports = router;