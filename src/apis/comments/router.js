const router = require("express").Router();
const CommentController = require("./controller");
const validate = require("../../../utils/validator");
const { commentValidator, ticketComments } = require("./validation");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(CommentController.getAllComments);
router
  .route("/ticket/:id")
  .get(authorize, uuidValidator, CommentController.getCommentByTicket);

router.route("/:id").get(uuidValidator, CommentController.getOneComment);

router
  .route("/")
  .post(authorize, validate(commentValidator), CommentController.createComment);

router
  .route("/private")
  .post(
    authorize,
    validate(commentValidator),
    CommentController.createPrivateComment
  );

router
  .route("/escalate")
  .post(
    authorize,
    validate(commentValidator),
    CommentController.createEscalation
  );

router.route("/").patch(authorize, CommentController.editComment);

router.route("/deleteAllComments").delete(CommentController.deleteAllComments);

router
  .route("/:id")
  .delete(authorize, uuidValidator, CommentController.deleteComment);

module.exports = router;
