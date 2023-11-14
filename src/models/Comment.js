const { EntitySchema } = require("typeorm");

const Comment = new EntitySchema({
  name: "Comment",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    title: {
      type: "varchar",
      nullable: true,
    },
    description: {
      type: "text",
      nullable: true,
    },
    is_private: {
      type: "boolean",
      default: false,
    },
    emailTo: {
      type: "varchar",
      array: true,
      nullable: true,
    },
    emailCc: {
      type: "varchar",
      array: true,
      nullable: true,
    },
    is_escalation: {
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
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    ticket: {
      type: "many-to-one",
      target: "Ticket",
      joinColumn: {
        name: "ticket_id",
        referencedColumnName: "id",
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
});

module.exports = Comment;
