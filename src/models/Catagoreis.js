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
    knowledgeBase_id: {
      type: "varchar",
      nullable : true
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
     catagory_Id: {
      type: "many-to-one",
      target: "KnowledgeBase",
      joinColumn: {
        name: "knowledgeBase_id",
        referencedColumnName: "id",
      },
    },
  },
});

module.exports = Catagories;
;
