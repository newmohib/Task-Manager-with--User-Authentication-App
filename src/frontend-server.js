const express = require("express");
const path = require("path");

const PORT = process.env.ADMIN_END_PORT || 4000;

const StartFrontendServer = () => {
  const app = express();

  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });

  app
    .listen(PORT, () => {
      console.log(`Frontend Admin App running on port ${PORT}`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit();
    });
};

StartFrontendServer();
