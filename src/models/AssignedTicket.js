const { EntitySchema } = require("typeorm");

const AssignedTicket = new EntitySchema({
  name: "AssignedTicket",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
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
    assigned_user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
    }, 
    assigned_on: {
      type: "many-to-one",
      target: "Ticket",
      joinColumn: true,
    },
  },
});

module.exports = AssignedTicket;