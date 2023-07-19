// src/entities/User.js
const { EntitySchema } = require("typeorm");

const Admin = new EntitySchema({
  name: "Admin",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
    },
    age: {
      type: "int",
    },
  },
});

module.exports = Admin;
