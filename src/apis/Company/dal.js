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
      const company = await companyRepository
        .createQueryBuilder("company")
        .leftJoin("company.clients", "contacts")
        .leftJoin("company.tickets", "tickets")
        .leftJoin("tickets.assigned_users", "users")
        .leftJoin("tickets.ticket_type", "types")
        .leftJoin("tickets.ticket_priority", "priority")
        .leftJoin("tickets.ticket_status", "status")
        .leftJoin("tickets.department", "department")
        .leftJoin("department.team_lead", "team_lead")
        .leftJoin("tickets.client", "client")
        .leftJoin("tickets.comments", "comments")
        .select([
          "company.id",
          "company.company_name",
          "company.description",
          "company.health_score",
          "company.account_tier",
          "company.company_logo",
          "contacts.id",
          "contacts.email",
          "contacts.first_name",
          "contacts.last_name",
          "contacts.user_type",
          "tickets.id",
          "tickets.subject",
          "tickets.description",
          "tickets.created_at",
          "tickets.due_date",
          "tickets.closed",
          "types.type",
          "types.id",
          "priority.id",
          "priority.type",
          "status.id",
          "status.type",
          "status.status_color",
          "department.id",
          "department.type",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          "users.department",
          "users.user_type",
          "client.id",
          "client.email",
          "client.first_name",
          "client.last_name",
          "client.user_type",
          "comments.id",
          "comments.title",
          "comments.description",
          "comments.is_private",
          "comments.emailTo",
          "comments.emailCc",
          "comments.is_escalation",
          "comments.created_at",
          "comments.updated_at",
        ])
        .getMany();
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
      const company = await companyRepository
        .createQueryBuilder("company")
        .leftJoin("company.clients", "contacts")
        .leftJoin("company.tickets", "tickets")
        .leftJoin("tickets.assigned_users", "users")
        .leftJoin("tickets.ticket_type", "types")
        .leftJoin("tickets.ticket_priority", "priority")
        .leftJoin("tickets.ticket_status", "status")
        .leftJoin("tickets.department", "department")
        .leftJoin("department.team_lead", "team_lead")
        .leftJoin("tickets.client", "client")
        .leftJoin("tickets.comments", "comments")
        .select([
          "company.id",
          "company.company_name",
          "company.description",
          "company.health_score",
          "company.account_tier",
          "company.company_logo",
          "contacts.id",
          "contacts.email",
          "contacts.first_name",
          "contacts.last_name",
          "contacts.user_type",
          "tickets.id",
          "tickets.subject",
          "tickets.description",
          "tickets.created_at",
          "tickets.due_date",
          "tickets.closed",
          "types.type",
          "types.id",
          "priority.id",
          "priority.type",
          "status.id",
          "status.type",
          "status.status_color",
          "department.id",
          "department.type",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          "users.department",
          "users.user_type",
          "client.id",
          "client.email",
          "client.first_name",
          "client.last_name",
          "client.user_type",
          "comments.id",
          "comments.title",
          "comments.description",
          "comments.is_private",
          "comments.emailTo",
          "comments.emailCc",
          "comments.is_escalation",
          "comments.created_at",
          "comments.updated_at",
        ])
        .where("company.id = :id", { id })
        .getMany();

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
