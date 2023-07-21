const router = require("express").Router();
const knowledgebaseController = require("./controller");
const createKnowledgebaseValidator = require("./validation");
const validate = require("../../../utils/validator");
 
router.route("/").get(knowledgebaseController.getAllKnowledgebase);

router.route("/").post(validate(createKnowledgebaseValidator), knowledgebaseController.createKnowledgebase);

router.route("/:id").get(knowledgebaseController.getKnowlegebaseById)

router.route("/:id").patch(validate(createKnowledgebaseValidator), knowledgebaseController.updateOneKnowledgebase)

router.route("/:id").delete(knowledgebaseController.deleteOneKnowledgebase);

module.exports = router;