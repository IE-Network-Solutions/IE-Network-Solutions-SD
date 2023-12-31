// ticket-user.entity.js
const { EntitySchema } = require("typeorm");

const TicketUser = new EntitySchema({
  name: "TicketUser",
  columns: {
    ticket_id: {
      primary: true,
      type: "int",
    },
    user_id: {
      primary: true,
      type: "int",
    },
  },
  relations: {
    ticket: {
      type: "many-to-one",
      target: "Ticket",
      joinColumn: {
        name: "ticket_id",
        referencedColumnName: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
});

module.exports = TicketUser;
