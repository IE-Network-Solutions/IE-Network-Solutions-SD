const { getConnection } = require("typeorm");
const Company = require("../../models/Company");
const { v4: uuidv4 } = require("uuid");
var fs = require("fs");
const AppError = require("../../../utils/apperror");

class CompanyDAL {
  static async allCompanies() {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const companyRepository = await connection.getRepository(Company);

      // find all company data
      const company = await companyRepository.find();
      if (!company) {
        throw new Error("Error to fetch companies , try again!");
      }

      // return all fetched data
      return company;
    } catch (error) {
      throw error;
    }
  }

  static async getCompanyById(id) {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const companyRepository = await connection.getRepository(Company);
      // const fetchedCompany = await connection.manager.findOne(Company, 1, { relations: ['users'] });
      // get data
      const company = await companyRepository.findOne({
        where: { id },
        relations: ["clients"],
      });

      // return single data
      return company;
    } catch (error) {
      throw error;
    }
  }

  static async createCompany(data) {
    try {
      const id = uuidv4();
      const {
        company_name,
        description,
        notes,
        health_score,
        account_tier,
        company_logo,
      } = data;
      // get connection from the pool
      const connection = getConnection();
      // create bridge
      const companyRepository = connection.getRepository(Company);

      // create company
      const newcompany = await companyRepository.create({
        id,
        company_name,
        description,
        notes,
        health_score,
        account_tier,
        company_logo,
      });
      await companyRepository.save(newcompany);
      // console.log(newTest);
      return newcompany;
    } catch (error) {
      throw error;
    }
  }

  static async updateCompany(id, updatedFields) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const companyRepository = connection.getRepository(Company);
    const company = await companyRepository.findOneBy({ id: id });
    if (!company) {
      throw new Error("company not found");
    }

    companyRepository.merge(company, updatedFields);
    await companyRepository.save(company);

    return company;
  }

  static async deleteCompany(id) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const companyRepository = connection.getRepository(Company);

    const company = await companyRepository.findOneBy({ id });
    if (!company) {
      throw new Error("Company with the given id is not found");
    }
    const sourceUrls = `${company.company_logo}`;
    const deleLogo = await fs.unlinkSync(`./${sourceUrls}`);
    const deleteComp = await companyRepository.delete(id);
    if (!deleteComp && !deleLogo) {
      throw new Error("Error Deleting the Company , try again!");
    }

    return "Company deleted Successfully";
  }
}

module.exports = CompanyDAL;
