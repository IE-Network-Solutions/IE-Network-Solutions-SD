// src/entities/Test.js
const { EntitySchema } = require("typeorm");

const Test = new EntitySchema({
  name: "Test",
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

module.exports = Test;
