const router = require("express").Router();

const knowledgebaseController = require("./controller");
const uuidValidator = require('../../../utils/uuidValidator')
const knowledgeBaseController = require("./controller");
const createKnowledgeBaseValidator = require("./validation");
const validate = require("../../../utils/validator");

const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");
const { uploadOptions } = require("../../../utils/imageUpload");

router.route("/")
    .get(authorize, permissionMiddleware(['view-Knowledge-bases']), knowledgeBaseController.getKnowledgeBases)
    .post(authorize, permissionMiddleware(['create-Knowledge-base']), validate(createKnowledgeBaseValidator), uploadOptions.single("image"), knowledgeBaseController.createKnowledgeBase);

router.route("/:id")
    .patch(authorize, permissionMiddleware(['update-Knowledge-base']), uuidValidator, knowledgeBaseController.updateKnowledgeBaseById)
    .get(authorize, permissionMiddleware(['view-Knowledge-base']), uuidValidator, knowledgebaseController.getKnowlegeBaseById)
    .delete(authorize, permissionMiddleware(['delete-Knowledge-base']), uuidValidator, knowledgebaseController.deleteKnowledgeBaseById);

router.route("/catagoryId/:id")
    .get(authorize, permissionMiddleware(['view-knowledge-base-category']), knowledgeBaseController.getKnowledgeBaseByCatagoryId)

module.exports = router;