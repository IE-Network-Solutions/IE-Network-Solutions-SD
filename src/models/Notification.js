const { EntitySchema } = require("typeorm");

const Notification = new EntitySchema({
  name: "Notification",
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
    // Whether the notification is from system or users
    type: {
      type: "varchar",
      nullable: true,
    },
    // If user then this will be the UserUUID and if not it will be SYSTEM
    from: {
      type: "varchar",
      nullable: true,
    },
    to: {
      type: "varchar",
      nullable: true,
    },
    // The notification message
    message: {
      type: "text",
      nullable: true,
    },
    isRead: {
      type: "boolean",
      default: false,
      nullable: true,
    },

    CCUsers: {
      type: "varchar",
      nullable: true,
    },
    read_at: {
      type: "date",
      nullable: true,
    },
    dont_forget: {
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
    },
    created_to: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
    }
  },
});

module.exports = Notification;
