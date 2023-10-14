const AppError = require("../../../utils/apperror");
const Team = require("../../models/Team");
const DepartmentDAL = require("../department/dal");
const UserDAL = require("../users/dal");
const teamDAL = require("./dal");

exports.getAllTeams = async (req, res, next) => {
  try {
    const teams = await teamDAL.getAllTeams();

    // check if no team found
    if (!teams) {
      return next(new AppError("No teams found"));
    }

    res.status(200).json({
      status: "Success",
      data: teams,
    });
  } catch (error) {
    throw error;
  }
};

exports.createTeam = async (req, res, next) => {
  try {
    const data = req.body;
    data.created_by = req.user;

    // validate team
    const team_lead = await UserDAL.getOneUser(data.team_lead_id);

    if (!team_lead) {
      return next(new AppError("team lead does not exist"));
    }
    data.team_lead = team_lead;

    // validate department
    // const department = await DepartmentDAL.getDepartment(data.department_id);
    // if (!department) {
    //   return next(new AppError("department does not exist"));
    // }
    // data.department = department;

    // create team
    const team = await teamDAL.createTeam(data);

    // return created team data
    res.status(200).json({
      status: "Success",
      data: team,
    });
  } catch (error) {
    throw error;
  }
};

exports.getTeamById = async (req, res, next) => {
  const teams = await teamDAL.getTeam(req.params.id);

  if (!teams) {
    return next(new AppError("Team with the given id Not Found"));
  }
  res.status(200).json({
    status: "Success",
    data: teams
  })
}

exports.deleteTeamById = async (req, res, next) => {
  try {
    const team = await teamDAL.getTeam(req.params.id);

    if (!team) {
      return next(
        new AppError("Team with the given id is not found.", 404)
      );
    }
    await teamDAL.deleteTeamById(id);
    res.status(200).json({
      status: 200,
      message: "Team is successfully deleted"
    });
  } catch (error) {
    throw error;
  }
}

exports.updateTeamById = async (req, res, next) => {
  try {
    const team = await teamDAL.getTeam(req.params.id);

    if (!team) {
      return next(
        new AppError("Team with the given id Not Found", 404)
      );
    }
    const result = await teamDAL.updateTeam(req.params.id, req.body);
    if (!result) {
      return next(new AppError("Error team Updating", 400));
    }
    res.status(200).json({
      status: "Success",
      data: await teamDAL.getTeam(req.params.id)
    }
    );

  } catch (error) {
    throw error;
  }
}