const { EntitySchema } = require("typeorm");

const Permission = new EntitySchema({
  name: "Permission",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    name: {
      type: "varchar",
      nullable:true,
      unique: true
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  }
  ,
relations:{
    roles: {
      type: 'many-to-many',
      target: 'Role',
      joinTable: {
        name: 'role_permission',
        joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },

     user: {
      type: 'many-to-many',
      target: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      joinTable: {
        name: 'user_permission',
        joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
      },
    },
}
})


module.exports = Permission;
