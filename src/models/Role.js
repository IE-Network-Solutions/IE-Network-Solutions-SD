// Role.entity.js
const { EntitySchema } = require("typeorm");
const { v4: uuidv4 } = require("uuid"); 

const Role = new EntitySchema({
  name: "Role",
  columns: {
    id: {
      primary: true,
      type: "uuid",
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
