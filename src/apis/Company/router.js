const companyRouter = require("express").Router();
const CompanyController = require("./controller");
const validate = require("../../../utils/validator");
const createCompanyValidator = require("./validation");
const { uploadOptions } = require("../../../utils/imageUpload");
const authorize = require("../../middlewares/auth/authorization");
const permissionMiddleware = require("../../middlewares/permission.middleware");

companyRouter.route("/").get(authorize, CompanyController.allCompanies);

companyRouter
  .route("/")
  .post(
    authorize,
    permissionMiddleware(["create-company"]),
    uploadOptions.single("company_logo"),
    validate(createCompanyValidator),
    CompanyController.createCompany
  );
companyRouter
  .route("/:id")
  .get(
    authorize,
    permissionMiddleware(["view-company"]),
    CompanyController.singleCompany
  );
companyRouter
  .route("/:id")
  .patch(
    authorize,
    permissionMiddleware(["update-company"]),
    uploadOptions.single("company_profile_update"),
    validate(createCompanyValidator),
    CompanyController.updateCompany
  );
companyRouter
  .route("/:id")
  .delete(
    authorize,
    permissionMiddleware(["delete-company"]),
    CompanyController.deleteCompany
  );

companyRouter
  .route("/company/statisifaction/by-percent")
  .get(
    authorize,
    CompanyController.totalCompanySatisfaction
  );


module.exports = companyRouter;
