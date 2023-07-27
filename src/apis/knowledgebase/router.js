const router = require("express").Router();
const knowledgeBaseController = require("./controller");
const createKnowledgeBaseValidator = require("./validation");
const validate = require("../../../utils/validator");
 
router.route("/").get(knowledgeBaseController.getAllKnowledgeBase);

router.route("/").post(validate(createKnowledgeBaseValidator), knowledgeBaseController.createKnowledgeBase);

router.route("/:id").get(knowledgeBaseController.getKnowledgeBaseById)

router.route("/:id").patch(knowledgeBaseController.updateOneKnowledgeBase)

router.route("/:id").delete(knowledgeBaseController.deleteOneKnowledgeBase);

module.exports = router;