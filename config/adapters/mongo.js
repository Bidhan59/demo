const mongodb = require("mongodb");
const appRoot = require("app-root-path");

const isError = require(`${appRoot}/helpers/isError`);
const { MongoClient } = mongodb;
let dbForClose = null;
let log = null;
module.exports.init = initMongoDB;

async function initMongoDB(mongoURL, database, logger) {
  // connecting Mongo
  log = logger;
  const db = await MongoClient.connect(mongoURL, {
    loggerLevel: "info",
  }).catch((err) => err);

  if (isError(db)) {
    logger.error(`Error connecting to the ${mongoURL}`);
  }
  if (db != null) {
    logger.info(`Connected to db- ${database} at ${mongoURL}  `);
  }
  // If the Node process ends, cleanup existing connections
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);
  process.on("uncaughtException", (err) => {
    if (err.message === "dbForClose.close is not a function") process.exit(0);
  });
  dbForClose = db;
  return db.db(database);
}

function cleanup() {
  dbForClose.close(() => {
    log.info("Closing DB connection and Stopping the app. Bye bye.");
    process.exit(0);
  });
}
