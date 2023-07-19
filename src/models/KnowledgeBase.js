// knowledgebase.entity.js
const { EntitySchema } = require("typeorm");
const { v4: uuidv4 } = require("uuid"); // Import the uuid library

const KnowledgeBase = new EntitySchema({
  name: "KnowledgeBase",
  columns: {
    id: {
      primary: true,
      type: "uuid",
    },
    title: {
      type: "varchar",
    },
    category: {
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
  },
});

module.exports = KnowledgeBase;
