const { EntitySchema } = require("typeorm");

const Comment = new EntitySchema({
  name: "Comment",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    title: {
      type: "varchar",
      nullable: true,
    },
    description: {
      type: "text",
      nullable: true,
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
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
    }, 
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

module.exports = Comment;