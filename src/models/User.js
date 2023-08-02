const { EntitySchema } = require("typeorm");
const Company = require("./Company");

/**
 * Entitiy model for user table
 */

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
    role_id: {
      type: "varchar",
      nullable: true,
    },
    permission_id:{
      type: "varchar",
      nullable: true,
    },
    department: {
      type: "varchar",
      nullable: true,
    },
    user_type: {
      type: "varchar",
      nullable: true,
    },
    company_id:{
      type: "uuid",
      nullable:true
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
    },
    todos: {
      type: "one-to-many",
      target: "Todo",
      inverseSide: "user",
    },
    role: {
      type: "many-to-one",
      target: "Role",
      joinColumn: {
        name: "role_id",
        referencedColumnName: "id",
      },
      onDelete: "SET NULL",
      onUpdate: 'CASCADE'
    },
   
    company: {
      type: "many-to-one",
      target: "Company",
      inverseSide: "clients"
    },
    permissions: {
      type: 'many-to-many',
      target: 'Permission',
      joinTable: {
        name: 'user_permission',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
      },
      onDelete: "SET NULL",
      onUpdate: 'CASCADE'
    },
  },
});

module.exports = User;
