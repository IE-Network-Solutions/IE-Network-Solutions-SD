const { EntitySchema } = require("typeorm");

const Catagories = new EntitySchema({
  name: "Catagory",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    name: {
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
    knowledgebase: {
      type: "one-to-many",
      target: "KnowledgeBase",
      inverseSide: "catagory",
    },
  },
});

module.exports = Catagories;
;
