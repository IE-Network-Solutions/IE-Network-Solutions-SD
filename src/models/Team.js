const { EntitySchema } = require("typeorm");

const Team = new EntitySchema({
  name: "Team",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    name: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    is_deleted: {
      type: "varchar",
      default: false,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    created_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "createdBy_id",
        referencedColumnName: "id",
      },
    },
    tickets: {
      type: "one-to-many",
      target: "Ticket",
      joinColumn: {
        name: "ticket_id",
        referencedColumnName: "id",
      },
    },
    department: {
      type: "many-to-one",
      target: "Department",
      joinColumn: {
        name: "department_id",
        referencedColumnName: "id",
      },
    },
    team_lead: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "teamlead_id",
        referencedColumnName: "id",
      },
    },
  },
});

module.exports = Team;
