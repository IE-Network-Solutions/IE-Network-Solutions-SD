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

router.route("/filter").get(authorize, permissionMiddleware(["filter-tickets"]), TicketController.applyFilterOnTickets);

router
  .route("/junk")
  .get(TicketController.getAllJunkTickets)
router
  .route('/junk/untransfered')
  .get(TicketController.getAllUnTransferedJunkTickets)

router
  .route('/junk/:id')
  .get(TicketController.getJunkTicket)

  .post(authorize, TicketController.transferJunkTicketToTicket)
  .delete(uuidValidator, TicketController.deleteJunkTicket);


router
  .route("/user-assigned-ticket")
  .get(authorize, TicketController.getAssignedTicketsForLoggedinUser)
router.route("/tickt-status").get(authorize, TicketController.getTicketsByStatus);
router.route("/tickt-team-count").get(authorize, permissionMiddleware(["view-assign-agents"]), TicketController.getTicketsCountByTeam);
router.route("/").get(authorize, permissionMiddleware(["view-tickets"]), TicketController.getAllTickets);
router.route("/:id").get(authorize, permissionMiddleware(["view-ticket"]), TicketController.getTicketById);
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
    authorize, permissionMiddleware(["update-ticket"]), validate(updateTicketValidator), TicketController.updateTicket);
router
  .route("/:id")
  .delete(authorize, permissionMiddleware(["delete-tickets"]), uuidValidator, authorize, TicketController.deleteTicket);
router
  .route("/assign-user/:id")
  .post(
    authorize,
    permissionMiddleware(["assign-ticket-to-user"]),
    uuidValidator,
    validate(assignTicket),
    TicketController.assignUserToTicket
  );

router
  .route("/remove-user/:id")
  .post(authorize, permissionMiddleware(["remove-assigned-user-ticket"]), uuidValidator, TicketController.removeAssigned);

router
  .route("/getAllTickets/groupByTeam")
  .get(authorize, TicketController.groupAllTicketsByTeamAndGet);

router.route("/getAllTickets/ForCurrentLoggedInUser").get(
  authorize,
  permissionMiddleware(["view-ticket-for-logged-in-user"]),
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

router
  .route("/getAgentStatusForTeamById/:id")
  .get(
    authorize,
    TicketController.getAgentStatusForTeamById
  );

router
  .route("/get-all/escaletes")
  .get(
    authorize,
    TicketController.getAllEscalates
  );

router
  .route("/get-agent-status/all")
  .get(
    authorize,
    TicketController.getAllAgentStatus
  );

router
  .route("/view-ticket-detail/by-admin-by-id/:id")
  .get(
    authorize,
    TicketController.viewTicketdetailByAdminById
  );

router
  .route("/close-ticket/by-ticket-id/:id")
  .patch(
    authorize,
    TicketController.closeTicket
  );

router.route("/tickets/client-rating/rate/:id").
  patch(authorize, TicketController.clientRating);

router.route("/tickets/update-priority/:id").
  patch(authorize, TicketController.updateTicketPriority);




module.exports = router;
