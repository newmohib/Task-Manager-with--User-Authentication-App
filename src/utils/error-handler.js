const { createLogger, transports } = require("winston");
const { AppError } = require("./app-errors");
// const { DB_ERROR_URL, DB_BASE_URL } = require("../config");

// want to store logs in a MongoDB database
// require("winston-mongodb");

//want to send logs to a remote server via HTTP or HTTPS
//npm install winston-transport-http

//want to send logs to a Logstash server (often used with the ELK stack)
//npm install winston-logstash

// Create Logg into console and file or we can add remote store
// new logger instance with two transports

// const LogErrors = createLogger({
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: 'app_error.log' }),
//     new transports.MongoDB({
//       db: DB_BASE_URL,
//       collection: 'error_amazon_demo',
//       options: {
//           useUnifiedTopology: true
//       },
//       level: 'error' // Store only error level logs
//   })
//   ]
// });

const LogErrors = createLogger({
  transports: [
    new transports.Console({
      level: "info", // Change this to 'error' if you want to log only errors to the console
    }),
    new transports.File({
      filename: "app_error.log",
      level: "error", // Store only error level logs in the file
    }),
    // new transports.MongoDB({
    //   db: DB_ERROR_URL,
    //   collection: "logs",
    //   level: "error", // Store only error level logs in MongoDB
    //   options: {
    //     useNewUrlParser: true, // Optional: Set it if you encounter issues with the connection
    //     useUnifiedTopology: true, // Set to use the new topology engine
    //   },
    // }),
  ],
});

class ErrorLogger {
  constructor() {}
  async logError(err) {
    console.log("==================== Start Error Logger ===============");
    LogErrors.log({
      private: true,
      level: "error",
      message: `${new Date()}-${JSON.stringify(err)}`,
    });
    console.log("==================== End Error Logger ===============");
    // log error with Logger plugins

    return false;
  }

  isTrustError(error) {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  }
}

const ErrorHandler = async (err, req, res, next) => {
  const errorLogger = new ErrorLogger();

  // process.on("uncaughtException", (reason, promise) => {
  //   console.log(reason, "UNHANDLED");
  //   throw reason; // need to take care
  // });

  // process.on("uncaughtException", (error) => {
  //   errorLogger.logError(error);
  //   if (errorLogger.isTrustError(err)) {
  //     //process exist // need restart
  //   }
  // });


  // console.log(err.description, '-------> DESCRIPTION')
  // console.log(err.message, '-------> MESSAGE')
  // console.log(err.name, '-------> NAME')
  if (err) {
    await errorLogger.logError(err);
    if (errorLogger.isTrustError(err)) {
      if (err.errorStack) {
        const errorDescription = err.errorStack;
        return res.status(err.statusCode || 500).json({ message: errorDescription });
      }
      return res.status(err.statusCode || 500).json({ message: err.message });
    } else {
      //process exit // terriablly wrong with flow need restart
    }
    return res.status(err.statusCode || 404).json({ message: err.message });
  }
  next();
};

// LogErrors.error("Error log: This is a test error log.");

module.exports = ErrorHandler;