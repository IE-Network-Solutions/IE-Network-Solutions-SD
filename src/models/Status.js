const { EntitySchema } = require("typeorm");

const Priority = new EntitySchema({
    name: "Status",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        type: {
            type: "varchar",
            nullable: false,
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
        created_by: {
            type: "one-to-many",
            target: "User",
            joinColumn: {
                name: "user_id",
                referencedColumnName: "id",
            },
        },
        created_on: {
            type: "one-to-one",
            target: "Ticket",
            joinColumn: {
              name: "ticket_id",
              referencedColumnName: "id",
            },
        },
    }
})

module.exports = Priority;