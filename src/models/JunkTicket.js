const { EntitySchema } = require("typeorm");

const JunkTicket = new EntitySchema({
  name: "JunkTicket",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      
    },
    subject: {
      type: "varchar",
      nullable:true

    },
    senderEmail: {
      type: "text",
      nullable:true

    },
    body: {
      type: "varchar",
      nullable:true

    },
    isTransfered: {
      type: "boolean",
      default:false,
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
 
});

module.exports = JunkTicket;
