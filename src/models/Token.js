// src/entities/User.js
const { EntitySchema } = require("typeorm");

const Token = new EntitySchema({
    name: "tokens",
    columns: {
        userId: {
            primary: true,
            type: "varchar"
        },
        token: {
            type: "varchar",
        },
        isRevoked: {
            type: 'boolean',
        }
    },
});

module.exports = Token;
