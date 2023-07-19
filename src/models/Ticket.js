// ticket.entity.js
const { EntitySchema } = require("typeorm");

const Ticket = new EntitySchema({
  name: "Ticket",
  columns: {
    id: {
      primary: true,
      type: "uuid",
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
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
    },
    assigned_users: {
      type: "many-to-many",
      target: "User",

      joinTable: {
        name: "ticket_assigned_users",
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
