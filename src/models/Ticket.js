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
    status: {
      type: "varchar",
    },
    priority: {
      type: "varchar",
      nullable:true
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
  },
});

module.exports = Ticket;
