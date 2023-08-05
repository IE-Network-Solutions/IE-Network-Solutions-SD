const router = require("express").Router();

const knowledgebaseController = require("./controller");
const createKnowledgebaseValidator = require("./validation"); 
const uuidValidator = require('../../../utils/uuidValidator')
const knowledgeBaseController = require("./controller");
const createKnowledgeBaseValidator = require("./validation");
const validate = require("../../../utils/validator");
 
router.route("/").get(uuidValidator, knowledgeBaseController.getAllKnowledgebase);

router.route("/").post(validate(createKnowledgeBaseValidator), knowledgeBaseController.createKnowledgebase);

router.route("/:id").get(uuidValidator, knowledgebaseController.getKnowlegebaseById)

router.route("/:id").patch(validate(createKnowledgebaseValidator), knowledgebaseController.updateOneKnowledgebase)

router.route("/:id").delete(uuidValidator, knowledgebaseController.deleteOneKnowledgebase);
router.route("/:id").get(knowledgeBaseController.getKnowledgeBaseById)

router.route("/:id").patch(knowledgeBaseController.updateOneKnowledgebase)

router.route("/:id").delete(knowledgeBaseController.updateOneKnowledgebase);

module.exports = router;