const configs = require("../../utils/configs");

// error for development server
const errorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errorStack: err.stack,
  });
};

// error for production server
const errForProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "ERROR",
      message: "Opps! Something Went wrong...",
    });
  }
};

/**
 * Global Error Handler
 */
const geh = (err, req, res, next) => {
  // if statusCode is missing assign 500
  err.statusCode = err.statusCode ? err.statusCode : 500;
  // if status is missing assign error
  err.status = err.status ? err.status : "ERROR";

  if (configs.env === "Development") errorForDev(err, res);
  if (configs.env === "Production") errForProduction(err, res);
};

module.exports = geh;
