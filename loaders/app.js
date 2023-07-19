/**
 * a file to access all custom and third party middlewares
 * to the express stack of middlewares
 */

const express = require("express");
const geh = require("../src/geh");
const AppError = require("../utils/apperror");
const testRoute = require('../src/apis/test/router');
const ticketRoute = require('../src/apis/tickets/router')

const app = express();

/**
 * add middlewares here
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/tests", testRoute);
app.use("/api/v1/tickets", ticketRoute);

// Unknown URL Error Message
app.use("*", (req, res, next) => {
  return next(
    new AppError(
      `Unknown URL - ${req.protocol}://${req.headers.host}${req.originalUrl}`,
      404
    )
  );
});

// use global error handler
app.use(geh);

// export app
module.exports = app;
