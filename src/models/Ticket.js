// ticket.entity.js
const { EntitySchema } = require("typeorm");

const Ticket = new EntitySchema({
  name: "Ticket",
  columns: {
    ticket_id: {
      primary: true,
      type: "int",
      generated: true,
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
    assigned_to: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
    },
  },
});

module.exports = { Ticket };
