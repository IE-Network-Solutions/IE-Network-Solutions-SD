const { EntitySchema } = require("typeorm");

const Priority = new EntitySchema({
  name: "Department",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    type: {
      type: "varchar",
      nullable: false,
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
      type: "one-to-many",
      target: "User",
      joinColumn: {
        name: "user_id",
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

module.exports = Priority;
