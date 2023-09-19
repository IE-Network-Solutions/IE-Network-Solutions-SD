const { EntitySchema } = require("typeorm");

const JunkTicket = new EntitySchema({
  name: "JunkTicket",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    subject: {
      type: "varchar",
    },
    senderEmail: {
      type: "text",
    },
    body: {
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
 
});

module.exports = JunkTicket;
