const configs = require("../utils/configs");

// configuration file for TypeORM db connection
module.exports = {
  type: "postgres",
  host: configs.db.postgres.host,
  port: configs.db.postgres.port,
  username: configs.db.postgres.userName,
  password: configs.db.postgres.pswd,
  database: configs.db.postgres.database,
  entities: [__dirname + "/../src/models/*.js"],
  synchronize: configs.env == "Development" ? true : true,
  migrations: [__dirname + "src/migrations/*.ts"], // Path to migration files
  cli: {
    entitiesDir: __dirname + "/../src/models/*.js",
    migrationsDir: __dirname + "/../src/migrations",
  },
  extra: {
    connectionLimit: configs.db.postgres.maxConn, // Set the pool size to 20 connections (adjust as needed)
    idleTimeoutMillis: configs.db.postgres.idleTimeOut,
    connectionTimeoutMillis: configs.db.postgres.connTimeOut,
  },
};
