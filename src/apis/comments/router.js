const router = require("express").Router();
const CommentController = require("./controller");
const validate = require("../../../utils/validator");
const { commentValidator, ticketComments } = require("./validation");
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(authorize, CommentController.getAllComments);
router
  .route("/ticket/:id")
  .get(authorize, uuidValidator, CommentController.getCommentByTicket);

router.route("/:id").get(authorize, uuidValidator, CommentController.getOneComment);

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
    authorize, permissionMiddleware(['create-comment-escalation']),
    validate(commentValidator),
    CommentController.createEscalation
  );

router.route("/").patch(authorize, permissionMiddleware(['update-comment']), CommentController.editComment);

router.route("/deleteAllComments").delete(authorize, permissionMiddleware(['delete-all-comments']), CommentController.deleteAllComments);

router
  .route("/:id")
  .delete(authorize, uuidValidator, CommentController.deleteComment);

module.exports = router;
