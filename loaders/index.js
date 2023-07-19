/**
 * a file to start express server
 */
const app = require("./app");
const http = require("http");
const configs = require("../utils/configs");
const createDatabaseConnection = require("./pgDB");

const igniter = async () => {
  // create db connection
  const connection = await createDatabaseConnection();

  // create server
  const server = http.createServer(app);
  const port = configs.port || 3001;

  // start listning
  server.listen(port, () => {
    console.log(`surver running on port: ${port}`);
  });

  // listn for errors
  server.on("error", (e) => {
    if (e.code === "EADDRINUSE") {
      console.error("Address in use, retrying...");
      setTimeout(() => {
        server.close();
        server.listen(port, () => {
          console.log(`server running on port: ${port}`);
        });
      }, 1000);
    }
  });
};

// Export
module.exports = igniter;
