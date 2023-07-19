const { EntitySchema } = require("typeorm");
const { v4: uuidv4 } = require("uuid"); // Import the uuid library

/**
 * Entitiy model for user table
 */

const User = new EntitySchema({
  name: "User",
  columns: {
    id: {
      primary: true,
      type: "uuid",
    },
    first_name: {
      type: "varchar",
      nullable: true,
    },
    last_name: {
      type: "varchar",
      nullable: true,
    },
    email: {
      type: "varchar",
    },
    role: {
      type: "varchar",
      nullable: true,
    },
    department: {
      type: "varchar",
      nullable: true,
    },
    user_type: {
      type: "varchar",
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
    tickets: {
      type: "one-to-many",
      target: "Ticket",
      inverseSide: "user",
    },
    assigned_tickets: {
      type: "many-to-many",
      target: "Ticket",
      joinTable: {
        name: "ticket_assigned_users",
        joinColumn: {
          name: "user_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "ticket_id",
          referencedColumnName: "id",
        },
      },
    },
    knowledgeBase: {
      type: "one-to-many",
      target: "KnowledgeBase",
      inverseSide: "created_by",
    },
    todos: {
      type: "one-to-many",
      target: "Todo",
      inverseSide: "user",
    },
  },
});

module.exports = User;
