const router = require("express").Router();
const CommentController = require("./controller");
const validate = require("../../../utils/validator");
const commentValidator = require("./validation")
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(CommentController.getAllComments);
router.route("/:id").get(uuidValidator, CommentController.getOneComment);


router
    .route("/")
    .post(CommentController.createComment);

router
    .route("/")
    .patch(authorize, CommentController.editComment);

router
  .route("/deleteAllComments")
  .delete(CommentController.deleteAllComments);

router
  .route("/:id")
  .delete(authorize, uuidValidator, CommentController.deleteComment);



module.exports = router;