const { EntitySchema } = require("typeorm");

const Priority = new EntitySchema({
  name: "Priority",
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
    priority_color: {
      type: "varchar",
      nullable: false,
    },
    is_deleted: {
      type: "boolean",
      default: false,
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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    tickets: {
      type: "one-to-many",
      target: "Ticket",
      joinColumn: {
        name: "ticket_id",
        referencedColumnName: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
});

module.exports = Priority;
