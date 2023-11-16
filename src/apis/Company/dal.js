const { getConnection, getRepository } = require("typeorm");
const Company = require("../../models/Company");
const { v4: uuidv4 } = require("uuid");
var fs = require("fs");
const AppError = require("../../../utils/apperror");
const { error } = require("console");

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
        .leftJoin("tickets.team", "team")
        .leftJoin("team.team_lead", "team_lead")
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
          "team.id",
          "team.name",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          "users.team",
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
        .leftJoin("tickets.team", "team")
        .leftJoin("team.team_lead", "team_lead")
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
          "team.id",
          "team.name",
          "users.id",
          "users.email",
          "users.first_name",
          "users.last_name",
          "users.role",
          "users.team",
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
        .getOne();

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
      console.log(company_logo);
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
      return newcompany;
    } catch (error) {
      throw error;
    }
  }

  static async updateCompany(id, updatedFields) {
    try {
      // create bridge
      const connection = getConnection();
      const companyRepository = connection.getRepository(Company);
      const company = await companyRepository.findOne({ where: { id: id } });
      if (!company) {
        throw new Error("company not found");
      }

      companyRepository.merge(company, updatedFields);
      await companyRepository.save(company);

      return company;
    } catch (error) {
      throw error
    }

  }

  static async deleteCompany(id) {
    const connection = getConnection();
    const companyRepository = connection.getRepository(Company);
    return await companyRepository.delete({ id });
  }

  // static async deleteCompanyqq(id) {
  //   try {
  //     // get connection from the pool
  //     const connection = getConnection();

  //     // create bridge
  //     const companyRepository = connection.getRepository(Company);

  //     const company = await companyRepository.findOneBy({ id });
  //     if (!company) {
  //       throw new Error("Company with the given id is not found");
  //     }
  //     const sourceUrls = `${company.company_logo}`;
  //     const deleLogo = await fs.unlinkSync(`./${sourceUrls}`);
  //     const deleteComp = await companyRepository.delete(id);
  //     if (!deleteComp && !deleLogo) {
  //       throw new Error("Error Deleting the Company , try again!");
  //     }
  //     return "Company deleted Successfully";
  //   } catch (error) {
  //     throw error
  //   }
  // }
}

module.exports = CompanyDAL;
