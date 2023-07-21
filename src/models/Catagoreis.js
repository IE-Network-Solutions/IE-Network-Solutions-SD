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
    knowledgeId:{
      type: "varchar",
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
    knowledgeId :{
      type: "many-to-one",
      target: "KnowledgeBase",
      joinColumn: {
        name: "knowledgeId",
        referencedColumnName: "id",
      },
    }
  },
});

module.exports = Catagories;
;
