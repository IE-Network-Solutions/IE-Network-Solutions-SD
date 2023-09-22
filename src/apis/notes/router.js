const router = require("express").Router();
const NoteController = require("./controller");
const validate = require("../../../utils/validator");
const noteValidator = require("./validation")
const { uuidValidator } = require("../../../utils/uuid");
const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.route("/").get(authorize, permissionMiddleware(['view-notes']), NoteController.getAllNotes);
router.route("/:id").get(authorize, permissionMiddleware(['view-note']), uuidValidator, NoteController.getOneNote);

router
  .route("/")
  .post(authorize, permissionMiddleware(['create-note']), NoteController.createNote);

router
  .route("/")
  .patch(authorize, permissionMiddleware(['update-note']), NoteController.editNote);

router
  .route("/deleteAllNotes")
  .delete(authorize, permissionMiddleware(['delete-notes']), NoteController.deleteAllNotes);

router
  .route("/:id")
  .delete(authorize, permissionMiddleware(['delete-note']), uuidValidator, NoteController.deleteNote);


module.exports = router;