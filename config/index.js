const mongo = require("./adapters/mongo");
const keys = require("./keys");

let logger = null;
const connectTodb = async () => {
  const mongoURI = `mongodb://${keys.MONGO_SERVER}:${keys.MONGO_PORT}`;
  const db = await mongo.init(mongoURI, keys.DB_NAME, logger);
  return db;
};
module.exports = function (log) {
  logger = log.appLogger || console;

  return {
    getDB: connectTodb,
  };
};
