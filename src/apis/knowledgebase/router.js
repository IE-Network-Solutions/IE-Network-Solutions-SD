const router = require("express").Router();
const knowledgebaseController = require("./controller");
const createKnowledgebaseValidator = require("./validation");
const uuidValidator = require('../../../utils/uuidValidator')
const validate = require("../../../utils/validator");
 
router.route("/").get(knowledgebaseController.getAllKnowledgebase);

router.route("/").post(validate(createKnowledgebaseValidator), knowledgebaseController.createKnowledgebase);

router.route("/:id").get(uuidValidator, knowledgebaseController.getKnowlegebaseById)

router.route("/:id").patch(uuidValidator, validate(createKnowledgebaseValidator), knowledgebaseController.updateOneKnowledgebase)

router.route("/:id").delete(uuidValidator, knowledgebaseController.deleteOneKnowledgebase);

module.exports = router;