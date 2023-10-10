const { EntitySchema } = require("typeorm");

const Notification = new EntitySchema({
  name: "Notification",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    // Whether the notification is from system or users
    type: {
      type: "text",
      nullable: true,
    },
    // If user then this will be the UserUUID and if not it will be SYSTEM
    from: {
      type: "text",
      nullable: true,
    },
    // The notification message
    message: {
      type: "text",
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
    created_to:{
      type:   "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
    }
  },
});

module.exports = Notification;
