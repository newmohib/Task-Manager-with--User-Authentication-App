const express = require("express");
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
