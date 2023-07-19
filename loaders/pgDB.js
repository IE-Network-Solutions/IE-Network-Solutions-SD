// db.js
const { createConnection } = require("typeorm");
const dbConfig = require("./dbConfig");

async function createDatabaseConnection() {
  const connection = await createConnection(dbConfig);

  return connection;
}

module.exports = createDatabaseConnection;
