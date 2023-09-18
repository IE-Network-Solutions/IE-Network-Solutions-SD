// team-user.entity.js
const { EntitySchema } = require("typeorm");

const TeamUser = new EntitySchema({
  name: "TeamUser",
  columns: {
    team_id: {
      primary: true,
      type: "int",
    },
    user_id: {
      primary: true,
      type: "int",
    },
  },
  relations: {
    team: {
      type: "many-to-one",
      target: "Team",
      joinColumn: {
        name: "team_id",
        referencedColumnName: "id",
      },
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
    },
  },
});

module.exports = TeamUser;
