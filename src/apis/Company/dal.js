const { getConnection } = require("typeorm");
const Company = require("../../models/Company");
const {v4: uuidv4} = require('uuid');

class CompanyDAL {
  static async allCompanies() {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const companyRepository = await connection.getRepository(Company);

      // find all company data
      const company = await companyRepository.find();

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

      // get data
      const company = await companyRepository.findOneBy({
        id: id,
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
company_logo

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
company_logo });
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

    await companyRepository.delete(id);

    return "company deleted Successfully";
  }
}

module.exports = CompanyDAL;
