const express = require("express");
const morgan = require("morgan");
const logger = require("./logger").logger("demo");
const config = require("./config")(logger);
const path = require("app-root-path");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const routers = require(`./routers`);

async function startApp() {
  // cors middleware donot remove
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, DELETE, PUT"
    );
    if (req.method === "OPTIONS") {
      res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With, x-access-token, x-email-id, x-device-id, x-device-token, x-device-type, role, role-region, admin, user-id, type, userid, self, email, position, id, displayName, name",
      });

      return res.sendStatus(204);
    }

    next();
  });
  app.use(
    morgan(logger.morganLogger.format, {
      stream: logger.morganLogger.stream,
    })
  );
  app.use(express.static(`${__dirname}/public`));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logger.appLogger.info("Booting Shopping Cart");
  logger.appLogger.info(`ENV - ${process.env.NODE_ENV}`);
  logger.appLogger.info(`DB SERVER - ${process.env.MONGO_SERVER}`);
  logger.appLogger.info("Connecting to Database");
  // connect to the database
  const db = await config.getDB();
  if (db == null) {
    logger.appLogger.info(`DB cannot be connected Stopping the APP`);
    process.exit(1);
  }
  // attach the db on each req similar to v2 platform version.
  // right now just make just bri
  app.use((req, res, next) => {
    req.db = {
      demo: db,
    };
    next();
  });
  app.use(express.json({ limit: "5MB" }));
  logger.appLogger.info("Attaching the routes");
  app.use("/demo/api/v1", routers);
  app.use((req, res, next) => {
    // catch 404 and forward to error handler
    const err = new Error("Resource Not Found");
    err.status = 404;
    next(err);
  });

  // final all error handler
  // disabling eslint for the case next is never used in the final all handler
  // but expressjs needs four paramater in the last handler to be the error
  // handler thing.
  /* eslint-disable-next-line  */
  app.use((err, req, res, next) => {
    logger.httpLogger.error(req, {
      message: err.message,
      error: err,
    });
    const statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";

    // if status code is 500 by defaul't then replace the message
    // that is coming from the stack error message, for it's
    // internal message an developer has handled it properly
    // and should not to be displayed.
    if (statusCode === 500) {
      message = "Internal Server Error";
    }
    res.status(statusCode).json({ message });
  });

  logger.appLogger.info("Booting Shopping Cart Done");
  logger.appLogger.info("Staring the Application");
  return app;
}

module.exports = startApp;
