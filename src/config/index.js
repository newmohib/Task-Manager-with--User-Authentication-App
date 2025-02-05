const dotEnv = require("dotenv");
const { log } = require("winston");
const path = require("path");

if (process.env.NODE_ENV !== "prod") {
  // const configFile = `./.env.${process.env.NODE_ENV}`;
  const configFile = path.join(process.cwd(), `.env.${process.env.NODE_ENV}`);
  console.log({ configFile });
  dotEnv.config({ path: configFile });
  //   console.log(configFile)
  log({
    level: "info",
    message: `Loaded environment from: ${configFile}`,
  });

  // log(configFile)
} else {
  dotEnv.config({ path: path.join(process.cwd(), ".env") });

  // dotEnv.config();
  //   console.log(dotEnv.config())
  log({
    level: "info",
    message: `Loaded environment from: ${dotEnv.config()}`,
  });
  // log(dotEnv.config())
}

module.exports = {
  PORT: process.env.PORT,
  // DB_BASE_URL: process.env.MONGODB_URI,
  DB_URL: process.env.MYSQL_URL,
  // DB_ERROR_URL: process.env.MYSQL_URL + process.env.DB_ERROR_COLLECTION_NAME,
  APP_SECRET: process.env.APP_SECRET,
};
