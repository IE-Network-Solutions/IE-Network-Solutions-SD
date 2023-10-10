const { getConnection } = require("typeorm");
const Team = require("../../models/Team");
const TeamUser = require("../../models/TeamUser");

class teamDAL {
  static async getAllTeams() {
    try {
      // create connection
      const connection = getConnection();

      // create connection bridge
      const teamRepository = connection.getRepository(Team);

      const teams = await teamRepository.find({
        where: { is_deleted: false },
        relations: ["tickets"],
      });

      // return all teams
      return teams;
    } catch (error) {
      throw error;
    }
  }

  static async getTeam(id) {
    try {
      // create connection
      const connection = getConnection();

      // create connection bridge
      const teamRepository = connection.getRepository(Team);

      const team = await teamRepository.findOne({
        where: { id: id, is_deleted: false },
      });

      // return single team data
      return team;
    } catch (error) {
      throw error;
    }
  }

  static async createTeam(data) {
    try {
      const { name, department, created_by, team_lead } = data;

      // connection
      const connection = getConnection();

      // create bridge with the db
      const teamRepository = connection.getRepository(Team);

      // create team
      const team = teamRepository.create({
        name: name,
        department: department,
        created_by: created_by,
        team_lead: team_lead,
      });
      await teamRepository.save(team);

      // return created team
      return team;
    } catch (error) {
      throw error;
    }
  }

  static async updateTeam(team, data) {
    try {
      const updatedFields = data;

      // create connetion
      const connecition = getConnection();

      // create bridge
      const teamRepository = connecition.getRepository(Team);

      const updatedTeam = teamRepository.merge(team, updatedFields);

      // check for department
      if (updatedFields.department) {
        updatedTeam.department = updatedFields.department;
      }

      // check for team lead
      if (updatedFields.team_lead) {
        updatedTeam.team_lead = updatedFields.team_lead;
      }

      await teamRepository.save(updatedTeam);

      return updatedTeam;
    } catch (error) {
      throw error;
    }
  }

  static async findMultipleTeams(teamIds) {
    try {
      // get connection
      const connection = getConnection();
      // get users
      const teamRepository = connection.getRepository(Team);
      const teams = await teamRepository.findByIds(teamIds);

      // return teams
      return teams;
    } catch (error) {
      throw error;
    }
  }

  static async getTeamByUserId(userId) {
    try {
      const connection = getConnection();
      const teamRepository = connection.getRepository(TeamUser);
      return await teamRepository.find({ where: { user_id: userId } });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = teamDAL;
