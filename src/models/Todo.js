const { EntitySchema } = require("typeorm");
const { v4: uuidv4 } = require("uuid"); // Import the uuid library

const Todo = new EntitySchema({
  name: "Todo",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "text",
      nullable: true,
    },
    status: {
      type: "varchar",
      default: "TODO",
    },
    due_date: {
      type: "timestamp",
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
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
    },
  },
});

module.exports = { Todo };
