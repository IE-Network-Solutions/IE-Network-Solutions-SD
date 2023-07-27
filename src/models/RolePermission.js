// ticket-user.entity.js
const { EntitySchema } = require("typeorm");

const RolePermisson = new EntitySchema({
  name: "RolePermisson",
  columns: {
    id :{
        type:"int",
        primary:true
    },
    Permission_id: {
      primary: true,
      type: "uuid",
    },
    Role_id: {
      primary: true,
      type: "uuid",
    },
  },
  relations: {
    permission: {
      type: "many-to-many",
      target: "Permission",
      joinColumn: {
        name: "permission_id",
        referencedColumnName: "id",
      },
    },
    role: {
      type: "many-to-many",
      target: "Role",
      joinColumn: {
        name: "role_id",
        referencedColumnName: "id",
      },
    },
  },
});

module.exports = RolePermisson;
