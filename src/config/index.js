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
  DB_URL: process.env.MYSQL_URL,
  APP_SECRET: process.env.APP_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  APP_URL: process.env.APP_URL,
};
