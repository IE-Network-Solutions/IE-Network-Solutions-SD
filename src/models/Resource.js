const { EntitySchema } = require("typeorm"); 

const Resource = new EntitySchema({
  name: "Resource",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    resourceName: {
      type: "varchar",
      unique: true,
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
    permissions: {
      type: "one-to-many",
      target: "Permission",
      joinColumn: true,
    },
  },
});

module.exports = Resource;
