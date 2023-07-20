// note.entity.js
const { EntitySchema } = require("typeorm");
const { v4: uuidv4 } = require("uuid");

const Note = new EntitySchema({
  name: "Note",
  columns: {
    id: {
      primary: true,
      type: "uuid",
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
      joinColumn: true,
    },
  },
});

module.exports = Note;
