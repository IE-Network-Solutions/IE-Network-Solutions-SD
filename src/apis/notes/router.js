const router = require("express").Router();
const NoteController = require("./controller");
const validate = require("../../../utils/validator");
const noteValidator = require("./validation")
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");

router.route("/").get(NoteController.getAllNotes);
router.route("/:id").get(authorize, uuidValidator, NoteController.getOneNote);

router
  .route("/")
  .post(NoteController.createNote);

router
    .route("/")
    .patch(authorize, NoteController.editNote);

router
  .route("/deleteAllNotes")
  .delete(NoteController.deleteAllNotes);

router
  .route("/:id")
  .delete(authorize, uuidValidator, NoteController.deleteNote);


module.exports = router;