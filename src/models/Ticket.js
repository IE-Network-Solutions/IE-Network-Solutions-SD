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
    department: {
      type: "many-to-one",
      target: "Department",
      joinColumn: {
        name: "department_id",
        referencedColumnName: "id",
      },
    },
  },
});

module.exports = Ticket;
