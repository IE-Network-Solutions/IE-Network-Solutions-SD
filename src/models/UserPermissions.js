const { EntitySchema } = require("typeorm");

const UserPermission = new EntitySchema({
  name: "UserPermission",
  columns: {
    user_id: {
      type: "uuid",
      primary: true,
    },
    permission_id: {
      type: "uuid",
      primary: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    permission: {
      type: 'many-to-one',
      target: 'Permission',
      joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});

module.exports = UserPermission;
