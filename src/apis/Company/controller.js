const AppError = require("../../../utils/apperror");
const hash = require("../../../utils/hashpassword");
const companyDAL = require("./dal");




exports.allCompanies = async (req, res, next) => {
  try {
    //   get all companies
    const companies = await companyDAL.allCompanies();

    // check if companies data exist
    if (!companies) {
      // return custom error
      return next(new AppError("No company data found" ));
    }

    // response
    res.status(200).json({
      status: "Success",
      data: companies,
    });
  } catch (error) {
    throw error;
  }
};

exports.singleCompany = async (req, res, next) => {
  try {
    const id = req.params.id;

    // get company with the given id
    const company = await companyDAL.getCompanyById(id);

    if (!company) return next(new AppError("company with the given id not found"));

    res.status(200).json({
      status: "Success",
      data: company,
    });
  } catch (error) {
    throw error;
  }
};

exports.createCompany = async (req, res, next) => {
  try {
    const data = req.body;
    const profileImage = req.file ? req.file.path : '';
    data.company_logo = profileImage

    
    
    //   create new company
    const company = await companyDAL.createCompany(data);

    res.status(201).json({
      status: "Success",
      data: company,
    });
  } catch (error) {
    throw error;
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const {id} = req.params;

    const updatedFields = req.body;
    const profileImage = req.file ? req.file.path : '';

    updatedFields.company_logo = profileImage
    // check if company exist or not
    const companyData = await companyDAL.getCompanyById(id);

    if (!companyData)
      return next(new AppError("company with the given id not found"));

    const company = await companyDAL.updateCompany(id, updatedFields);

    res.status(200).json({
      status: "Success",
      data: company,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const id = req.params.id;

    // validate if company exist or not
    const companyData = await companyDAL.getCompanyById(id);

    if (!companyData)
      return next(new AppError("company with the given id not found"));

    await companyDAL.deleteCompany(id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};
