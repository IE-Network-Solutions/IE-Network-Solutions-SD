/**
 * a file to access all custom and third party middlewares
 * to the express stack of middlewares
 */

const express = require("express");
const geh = require("../src/geh");
const AppError = require("../utils/apperror");
const ticketRoute = require('../src/apis/tickets/router')
const TestRoute = require("../src/apis/test/router");
const clientRouter = require("../src/apis/Client/router");
const TodoRoute = require("../src/apis/todos/router");
const UserRoute = require("../src/apis/users/router");
const CommentsRoute = require("../src/apis/comments/router");
const NotesRoute = require("../src/apis/notes/router");
const PriorititesRoute = require("../src/apis/priority/router");
const StatusesRoute = require("../src/apis/status/router");
const DepartmentRoute = require("../src/apis/department/router");
const TypeRoute = require("../src/apis/type/router");

const knowledgebaseRoute = require("../src/apis/knowledgebase/router") 

const app = express();

/**
 * add middlewares here
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/tickets", ticketRoute);
app.use("/api/v1/tests", TestRoute);
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/todos", TodoRoute);
app.use("/api/v1/users", UserRoute);
app.use("/api/v1/comments", CommentsRoute);
app.use("/api/v1/notes", NotesRoute);
app.use("/api/v1/prioritites", PriorititesRoute);
app.use("/api/v1/statuses", StatusesRoute);
app.use("/api/v1/departments", DepartmentRoute);
app.use("/api/v1/types", TypeRoute);

app.use("/api/v1/knowlegebase", knowledgebaseRoute); 

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
