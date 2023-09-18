const router = require("express").Router();

const knowledgebaseController = require("./controller");
const createKnowledgebaseValidator = require("./validation");
const uuidValidator = require('../../../utils/uuidValidator')
const knowledgeBaseController = require("./controller");
const createKnowledgeBaseValidator = require("./validation");
const validate = require("../../../utils/validator");

router.route("/")
    .get(knowledgeBaseController.getKnowledgeBases)
    .post(validate(createKnowledgeBaseValidator), knowledgeBaseController.createKnowledgeBase);

router.route("/:id")
    .patch(uuidValidator, knowledgeBaseController.updateKnowledgeBaseById)
    .get(uuidValidator, knowledgebaseController.getKnowlegeBaseById)
    .delete(uuidValidator, knowledgebaseController.deleteKnowledgeBaseById);


module.exports = router;