// Permission.entity.js
const { EntitySchema } = require("typeorm");
const { v4: uuidv4 } = require("uuid");

const Permission = new EntitySchema({
  name: "Permission",
  columns: {
    id: {
      primary: true,
      type: "uuid",
    },
    view: {
      type: "boolean",
    },
    create: {
      type: "boolean",
    },
    update: {
      type: "boolean",
    },
    delete: {
      type: "boolean",
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
    given_for: {
      type: "many-to-one",
      target: "Role",
      joinColumn: true,
    },
    created_on: {
      type: "many-to-one",
      target: "Resource",
      joinColumn: true,
    },
  },
});

module.exports = Permission;
