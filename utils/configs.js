/**
 * a file to store all enviromental variables and can be accessed
 * from any part of the project
 */

// load variables from ".env" to "proccess.env"
require("dotenv").config();

const config = {
  url: process.env.URL,
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
  email: {
    hostURL: process.env.HOST_URL,
    emailPort: process.env.EMAIL_PORT,
    systemEmail: process.env.SYSTEM_EMAIL,
    emailPassword: process.env.SYSTEM_EMAIL_PASSWORD,
  },
  log: {
    logFilePath: process.env.LOG_FILE_PATH,
  },
  company_email: process.env.COMP_EMAIL,

  PUBLIC_VAPID_KEY: process.env.PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY: process.env.PRIVATE_VAPID_KEY,
};

module.exports = config;
