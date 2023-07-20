const { EntitySchema } = require("typeorm");

const Permission = new EntitySchema({
  name: "Permission",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
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
      joinColumn: {
        name: "role_id",
        referencedColumnName: "id",
      },
    },
    created_on: {
      type: "many-to-one",
      target: "Resource",
      joinColumn: {
        name: "resource_id",
        referencedColumnName: "id",
      },
    },
  },
});

module.exports = Permission;
