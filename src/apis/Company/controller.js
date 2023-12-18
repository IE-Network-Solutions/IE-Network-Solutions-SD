const AppError = require("../../../utils/apperror");
const CompanyDAL = require("./dal");
const companyDAL = require("./dal");

exports.allCompanies = async (req, res, next) => {
  try {
    //   get all companies
    const companies = await companyDAL.allCompanies();

    // check if companies data exist
    if (!companies) {
      // return custom error
      return next(new AppError("No company data found"));
    }

    // response
    res.status(200).json({
      status: "Success",
      data: companies,
    });
  } catch (error) {
    return next(new AppError(`Error with internal server or ${error.message}`, 500))
  }
};

exports.singleCompany = async (req, res, next) => {
  try {
    const id = req.params.id;

    // get company with the given id
    const company = await companyDAL.getCompanyById(id);

    if (!company)
      return next(new AppError("company with the given id not found"));

    res.status(200).json({
      status: "Success",
      data: company,
    });
  } catch (error) {
    return next(new AppError(`Error with internal server or ${error.message}`, 500))
  }
};

exports.createCompany = async (req, res, next) => {
  try {
    const data = req.body;
    const profileImage = req.file ? req.file.path : null;
    data.company_logo = profileImage;

    //   create new company
    const company = await companyDAL.createCompany(data);

    res.status(201).json({
      status: "Success",
      data: company,
    });
  } catch (error) {
    return next(new AppError(`Error with internal server or ${error.message}`, 500))
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    if (req.file) {
      const profileImage = req.file.path;
      updatedFields.company_logo = profileImage;
    }

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
    return next(new AppError(`Error with internal server or ${error.message}`, 500))
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const id = req.params.id;
    const companyData = await companyDAL.getCompanyById(id);
    if (!companyData)
      return next(new AppError("company with the given id not found"));
    res.status(200).json({
      status: "Success",
      data: await companyDAL.deleteCompany(id),
    });
  } catch (error) {
    return next(new AppError(`Error with internal server or ${error.message}`, 500))
  }
};

const perCompanySatisfaction = async (req, res, next) => {
  const companies = await companyDAL.allCompanies();

  if (!companies || companies.length === 0) {
    return res.status(404).json({
      status: "Error",
      message: "No companies found",
    });
  }

  const totalSatisfaction = companies.reduce((sum, company) => {
    const healthScore = parseInt(company?.health_score) || 0;
    return sum + healthScore;
  }, 0);
  return { totalSatisfaction };
};

exports.totalCompanySatisfaction = async (req, res, next) => {
  let totalTickets = 0, positiveSatisfaction = 0, negativeSatisfaction = 0;
  const clientCompanies = await CompanyDAL.allCompanies();
  clientCompanies.forEach((company) => {
    company.tickets.forEach((ticket) => {
      if (ticket.rate != 0) {
        totalTickets++;
        if (ticket.rate >= 3) {
          positiveSatisfaction++;
        } else {
          negativeSatisfaction++;
        }
      }
    });
  });

  const positivePercentage = (positiveSatisfaction / totalTickets) * 100;
  const negativePercentage = (negativeSatisfaction / totalTickets) * 100;
  res.status(200).json({
    status: "Success",
    data: { positivePercentage, negativePercentage, per: await perCompanySatisfaction() }
  })
};

