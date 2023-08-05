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
    permissions: {
      type: 'many-to-many',
      target: 'Permission',
      joinTable: {
        name: 'role_permission',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
      },
      onDelete: "SET NULL",
      onUpdate: 'CASCADE'
    },
    users: {
      type: "one-to-many",
      target: "User",
      joinColumn:true,
      cascade : false,
      inverseSide: "role",
    },
  },
});

module.exports = Role;
