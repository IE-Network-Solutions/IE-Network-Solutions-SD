const router = require("express").Router();
const catagoryController = require("./controller");
const catagoryvalidation = require("./validation");
const uuidValidator = require('../../../utils/uuidValidator')
const validate = require("../../../utils/validator");
 
router.route("/").get(catagoryController.getAllCatagories);

router.route("/").post(validate(catagoryvalidation), catagoryController.createCatagory);

router.route("/:id").get(uuidValidator, catagoryController.getCatagoryById)

router.route("/:id").patch(uuidValidator, catagoryController.updateCatagory)

router.route("/:id").delete(uuidValidator, catagoryController.deleteCatagory);

module.exports = router;