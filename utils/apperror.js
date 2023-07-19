/**
 * object to create a custom error
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "FAIL" : "ERROR";
    this.isOperational = true;
  }
}

// Export AppError
module.exports = AppError;
