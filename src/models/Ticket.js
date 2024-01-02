const { EntitySchema } = require("typeorm");

const Ticket = new EntitySchema({
  name: "Ticket",

  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    subject: {
      type: "varchar",
    },
    description: {
      type: "text",
    },
    due_date: {
      type: "date",
      nullable: true,
    },
    closed: {
      type: "boolean",
      default: false,
    },

    rate: {
      type: "varchar",
      default: 0,
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
    isRequested: {
      type: "boolean",
      default: false,
    }
  },
  relations: {
    assigned_users: {
      type: "many-to-many",
      target: "User",
      joinTable: {
        name: "ticket_user",
        joinColumn: {
          name: "ticket_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "user_id",
          referencedColumnName: "id",
        },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    ticket_priority: {
      type: "many-to-one",
      target: "Priority",
      joinColumn: {
        name: "priority_id",
        referencedColumnName: "id",
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    created_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "created_by",
        referencedColumnName: "id",
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    ticket_status: {
      type: "many-to-one",
      target: "Status",
      joinColumn: {
        name: "status_id",
        referencedColumnName: "id",
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    ticket_type: {
      type: "many-to-one",
      target: "Type",
      joinColumn: {
        name: "type_id",
        referencedColumnName: "id",
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    team: {
      type: "many-to-one",
      target: "Team",
      joinColumn: {
        name: "team_id",
        referencedColumnName: "id",
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    client: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "client_id",
        referencedColumnName: "id",
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    company: {
      type: "many-to-one",
      target: "Company",
      joinColumn: {
        name: "company_id",
        referencedColumnName: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    comments: {
      type: "one-to-many",
      target: "Comment",
      inverseSide: "ticket",
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
});

module.exports = Ticket;
