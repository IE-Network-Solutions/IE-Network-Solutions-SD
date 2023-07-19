// knowledgebase.entity.js
const { EntitySchema } = require("typeorm");

const KnowledgeBase = new EntitySchema({
  name: "KnowledgeBase",
  columns: {
    knowledge_id: {
      primary: true,
      type: "int",
      generated: true,
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
