const { EntitySchema } = require("typeorm"); 

const KnowledgeBase = new EntitySchema({
  name: "KnowledgeBase",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
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
    createdBy:{
      nullable:false,
      type:"varchar"
    },
     image: {
      type: "varchar"
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
    createdBy: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "createdBy",
        referencedColumnName: "id",
      },
    },

    catagory : {
      type: "one-to-many",
      target: "Catagory",
      inverseSide: "knowledgeId",
    },
  },
});

module.exports = KnowledgeBase;
