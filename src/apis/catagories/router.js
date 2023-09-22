const router = require("express").Router();
const catagoryController = require("./controller");
const catagoryvalidation = require("./validation");
const uuidValidator = require('../../../utils/uuidValidator')
const validate = require("../../../utils/validator");
const permissionMiddleware = require("../../middlewares/permission.middleware");
const authorize = require("../../middlewares/auth/authorization");

router.route("/")
    .get(authorize, permissionMiddleware(['view-categories']), catagoryController.getAllCatagories)
    .post(authorize, permissionMiddleware(['create-category']), validate(catagoryvalidation), catagoryController.createCatagory);

router.route("/:id")
    .get(authorize, permissionMiddleware(['view-category']), uuidValidator, catagoryController.getCatagoryById)
    .patch(authorize, permissionMiddleware(['update-category']), uuidValidator, catagoryController.updateCatagory)
    .delete(authorize, permissionMiddleware(['delete-category']), uuidValidator, catagoryController.deleteCatagory);

module.exports = router;