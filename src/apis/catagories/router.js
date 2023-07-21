const router = require("express").Router();
const catagoryController = require("./controller");
const catagoryvalidation = require("./validation");
const validate = require("../../../utils/validator");
 
router.route("/").get(catagoryController.getAllCatagories);

router.route("/").post(validate(catagoryvalidation), catagoryController.createCatagory);

router.route("/:id").get(catagoryController.getCatagoyById)

router.route("/:id").patch(catagoryController.updateCatagory)

router.route("/:id").delete(catagoryController.deleteCatagory);

module.exports = router;