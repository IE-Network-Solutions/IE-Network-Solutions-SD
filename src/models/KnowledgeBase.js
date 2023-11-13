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
    description: {
      type: "text",
    },
    createdBy: {
      nullable: false,
      type: "varchar"
    },
    catagoryId: {
      type: "varchar",
      nullable: true
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
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

    catagory: {
      type: "many-to-one",
      target: "Catagory",
      joinColumn: {
        name: "catagoryId",
        referencedColumnName: "id",
      },
      onDelete: "SET NULL",
      onUpdate: 'CASCADE'
    }
  },
});

module.exports = KnowledgeBase;
