const router = require("express").Router();
const CommentController = require("./controller");
const validate = require("../../../utils/validator");
const commentValidator = require("./validation")
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(authorize, CommentController.getAllComments);
router.route("/:id").get(authorize, uuidValidator, CommentController.getOneComment);

router
  .route("/")
  .post(validate(commentValidator), CommentController.createComment);

router
    .route("/")
    .patch(authorize, CommentController.editComment);

router
  .route("/deleteAllComments")
  .delete(authorize, CommentController.deleteAllComments);

router
  .route("/:id")
  .delete(authorize, uuidValidator, CommentController.deleteComment);



module.exports = router;