const express = require("express");
const path = require("path");
const { PORT } = require("./config");
const { databaseConnection } = require("./database");
const expressApp = require("./express-app");

const StartServer = async () => {
  const app = express();

  await databaseConnection.init();

  await expressApp(app);

  app
    .listen(PORT, () => {
      console.log(`listening to port for Backend Server app ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartServer();

const StartFrontendServer = async () => {
  const app = express();
  const PORT = process.env.ADMIN_END_PORT || 4000;

  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Catch-all handler to serve React's index.html for unknown routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });

  app
    .listen(PORT, () => {
      console.log(`listening to port for fronend Admin App ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartFrontendServer();
