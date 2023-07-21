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
    user_Id:{
      nullable:true,
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
    created_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_Id",
        referencedColumnName: "id",
      },
    },

     catatory: {
      type: "one-to-many",
      target: "Catagory",
      inverseSide: "catagory_Id",
    }
  },
});

module.exports = KnowledgeBase;
