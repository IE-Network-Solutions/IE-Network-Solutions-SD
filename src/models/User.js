const { EntitySchema } = require("typeorm");

/**
 * Entitiy model for user table
 */

const User = new EntitySchema({
  name: "User",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
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
    assignedTickets: {
      type: "one-to-many",
      target: "Ticket",
      inverseSide: "assigned_to",
    },
    knowledgeBase: {
      type: "one-to-many",
      target: "KnowledgeBase",
      inverseSide: "created_by",
    },
  },
});

module.exports = User;
