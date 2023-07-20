// Resource.entity.js
const { EntitySchema } = require("typeorm");
const { v4: uuidv4 } = require("uuid");

const Resource = new EntitySchema({
  name: "Resource",
  columns: {
    id: {
      primary: true,
      type: "uuid",
    },
    resourceName: {
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
    permissions: {
      type: "one-to-many",
      target: "Permission",
      joinColumn: true,
    },
  },
});

module.exports = Resource;
