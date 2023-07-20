// comment.entity.js
const { EntitySchema } = require("typeorm");

const Comment = new EntitySchema({
  name: "Comment",
  columns: {
    id: {
      primary: true,
      type: "uuid",
    },
    title: {
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
    created_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
    }, 
    created_on: {
      type: "many-to-one",
      target: "Ticket",
      joinColumn: true,
    },
  },
});

module.exports = Comment;