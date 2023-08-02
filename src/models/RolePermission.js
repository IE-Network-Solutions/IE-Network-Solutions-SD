const { EntitySchema } = require("typeorm");

const RolePermission = new EntitySchema({
  name: "RolePermission",
  columns: {
    role_id: {
      type: "uuid",
       primary:true,
    },
     permission_id: {
      type: "uuid",
      primary:true,
    },
  },
  relations: {
    role: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    },
    permission: {
      type: 'many-to-one',
      target: 'Permission',
      joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
      onDelete: "SET NULL",
      onUpdate: 'CASCADE'
    },
  },
});

module.exports = RolePermission;
