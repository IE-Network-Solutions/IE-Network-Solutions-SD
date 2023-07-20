const { EntitySchema } = require("typeorm");

const Note = new EntitySchema({
  name: "Note",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    body: {
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
    created_on: {
      type: "many-to-one",
      target: "Ticket",
      joinColumn: {
        name: "ticket_id",
        referencedColumnName: "id",
      },
    },
  },
});

module.exports = Note;
