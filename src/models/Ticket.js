const { EntitySchema } = require("typeorm");

const Ticket = new EntitySchema({
  name: "Ticket",

  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    subject: {
      type: "varchar",
    },
    description: {
      type: "text",
    },
    due_date: {
      type: "date",
      nullable: true,
    },
    closed: {
      type: "boolean",
      default: false,
    },
    is_deleted: {
      type: "boolean",
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
    assigned_users: {
      type: "many-to-many",
      target: "User",
      joinTable: {
        name: "ticket_user",
        joinColumn: {
          name: "ticket_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "user_id",
          referencedColumnName: "id",
        },
      },
    },
    ticket_priority: {
      type: "many-to-one",
      target: "Priority",
      joinColumn: {
        name: "priority_id",
        referencedColumnName: "id",
      },
    },
    created_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "created_by",
        referencedColumnName: "id",
      },
    },
    ticket_status: {
      type: "many-to-one",
      target: "Status",
      joinColumn: {
        name: "status_id",
        referencedColumnName: "id",
      },
    },
    ticket_type: {
      type: "many-to-one",
      target: "Type",
      joinColumn: {
        name: "type_id",
        referencedColumnName: "id",
      },
    },
    team: {
      type: "many-to-one",
      target: "Team",
      joinColumn: {
        name: "team_id",
        referencedColumnName: "id",
      },
    },
    client: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "client_id",
        referencedColumnName: "id",
      },
    },
    company: {
      type: "many-to-one",
      target: "Company",
      joinColumn: {
        name: "company_id",
        referencedColumnName: "id",
      },
    },
    comments: {
      type: "one-to-many",
      target: "Comment",
      inverseSide: "ticket",
    },
  },
});

module.exports = Ticket;
