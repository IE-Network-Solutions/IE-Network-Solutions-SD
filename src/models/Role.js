const { EntitySchema } = require("typeorm");

const Role = new EntitySchema({
  name: "Role",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    roleName: {
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
    users: {
      type: "one-to-many",
      target: "User",
      joinColumn: true,
    },
    permissions: {
      type: "one-to-many",
      target: "Permission",
      joinColumn: true,
    },
  },
});

module.exports = Role;
