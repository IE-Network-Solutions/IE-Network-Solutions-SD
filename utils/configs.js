/**
 * a file to store all enviromental variables and can be accessed
 * from any part of the project
 */

// load variables from ".env" to "proccess.env"
require("dotenv").config();

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  db: {
    postgres: {
      userName: process.env.PG_USER_NAME,
      pswd: process.env.PG_PASSWORD,
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE,
      idleTimeOut: process.env.PG_IDLE_TIMEOUT,
      connTimeOut: process.env.PG_CONN_TIMEOUT,
      maxConn: process.env.PG_MAX_CONN,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};

module.exports = config;
