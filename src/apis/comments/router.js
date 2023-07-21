const router = require("express").Router();
const CommentController = require("./controller");
// const validate = require("../../../utils/validator");
const { uuidValidator } = require("../../../utils/uuid");

router.route("/").get(CommentController.getAllComments);
router.route("/:id").get(uuidValidator, CommentController.getOneComment);

router
  .route("/")
  .post(CommentController.createComment);

router
    .route("/")
    .patch(CommentController.editComment);

router
  .route("/deleteAllComments")
  .delete(CommentController.deleteAllComments);

router
  .route("/:id")
  .delete(uuidValidator, CommentController.deleteComment);



module.exports = router;