const configs = require("../utils/configs");

// configuration file for TypeORM db connection
module.exports = {
  type: "postgres",
  url: configs.url,
  ssl: { rejectUnauthorized: false },

  // host: "dpg-ckimdr0lk5ic73cfbad0-a",
  // port: 5432,
  // username: "servicedesk_bnu7_user",
  // password: "dygb7GkAb4c80qoL59EFamynwD0XjgyH",
  // database: "servicedesk_bnu7",
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
