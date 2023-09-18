const companyRouter = require("express").Router();
const CompanyController = require("./controller");
const validate = require("../../../utils/validator");
const createCompanyValidator = require("./validation");
const { uploadOptions } = require("../../../utils/imageUpload");

companyRouter.route("/").get(CompanyController.allCompanies);

companyRouter
  .route("/")
  .post(
    uploadOptions.single("company_logo"),
    validate(createCompanyValidator),
    CompanyController.createCompany
  );
companyRouter.route("/:id").get(CompanyController.singleCompany);
companyRouter
  .route("/:id")
  .patch(
    uploadOptions.single("company_profile_update"),
    validate(createCompanyValidator),
    CompanyController.updateCompany
  );
companyRouter.route("/:id").delete(CompanyController.deleteCompany);

module.exports = companyRouter;
