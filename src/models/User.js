const { EntitySchema } = require("typeorm");
const Company = require("./Company");

/**
 * Entitiy model for user table
 */

const UserType = {
  Client: "client",
  Employee: "employee",
};

const User = new EntitySchema({
  name: "User",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    first_name: {
      type: "varchar",
      nullable: true,
    },
    last_name: {
      type: "varchar",
      nullable: true,
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
      nullable: true,
    },
    phone_number: {
      type: "varchar",
      nullable: true,
    },
    profile_pic: {
      type: "varchar",
      nullable: true,
    },
    password: {
      type: "varchar",
      nullable: true,
    },
    manager_id: {
      type: "varchar",
      nullable: true,
    },
    is_deleted: {
      type: "boolean",
      default: false,
    },
    user_type: {
      type: "enum",
      enum: Object.values(UserType),
      default: UserType.Client,
    },
    password_changed: {
      type: "boolean",
      default: false,
    },
    verificationCode: {
      type: "varchar",
      unique: true,
      nullable: true
    },
    passwordChangeToken: {
      type: "varchar",
      unique: true,
      nullable: true
    },
    tokenExpirationTime: {
      type: "bigint",
      nullable: true
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
    assigned_tickets: {
      type: "many-to-many",
      target: "Ticket",
      joinTable: {
        name: "ticket_user",
        joinColumn: {
          name: "user_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "ticket_id",
          referencedColumnName: "id",
        },
      },
    },
    knowledgeBase: {
      type: "one-to-many",
      target: "KnowledgeBase",
      inverseSide: "createdBy",
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    todos: {
      type: "one-to-many",
      target: "Todo",
      inverseSide: "user",
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    role: {
      type: "many-to-one",
      target: "Role",
      joinColumn: {
        name: "role_id",
        referencedColumnName: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    company: {
      type: "many-to-one",
      target: "Company",
      inverseSide: "clients",
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    permissions: {
      type: "many-to-many",
      target: "Permission",
      joinTable: {
        name: "user_permission",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: {
          name: "permission_id",
          referencedColumnName: "id",
        },
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
      joinColumn: {
        name: "company_id",
        referencedColumnName: "id",
      },
    },
    team: {
      type: "many-to-one",
      target: "Team",
      joinColumn: {
        name: "team_id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    ticket_type: {
      type: "many-to-one",
      target: "Type",
      joinColumn: {
        name: "type_id",
        referencedColumnName: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    ticket_priority: {
      type: "many-to-one",
      target: "Department",
      joinColumn: {
        name: "priority_id",
        referencedColumnName: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    ticket_status: {
      type: "many-to-one",
      target: "Status",
      joinColumn: {
        name: "status_id",
        referencedColumnName: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    manager: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "manager_id",
        referencedColumnName: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    client_tickets: {
      type: "one-to-many",
      target: "Ticket",
      inverseSide: "client",
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    teams_access: {
      type: "many-to-many",
      target: "Team",
      joinTable: {
        name: "team_user",
        joinColumn: {
          name: "user_id",
        },
        inverseJoinColumn: {
          name: "team_id",
        },
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    managed_teams: {
      type: "one-to-many",
      target: "Team",
      inverseSide: "team_lead",
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_by: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "created_by",
        referencedColumnName: "id",
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }
});

module.exports = User;
