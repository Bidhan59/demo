const appRoot = require("app-root-path");

const requiredParam = require(`${appRoot}/helpers/requiredParam`);
const collectionName = "customers";

const createNewUser = async ({
  user = requiredParam("user"),
  db = requiredParam("db"),
}) => {
  const insertedUser = await db.collection(collectionName).insert(user);
  return insertedUser;
};
const fetchValidCustomer = async ({
  selectionParameters = requiredParam("selectionParameters"),
  db = requiredParam("db"),
}) => {
  const customer = await db
    .collection(collectionName)
    .findOne(selectionParameters);
  return customer;
};
module.exports = Object.assign(
  {},
  {
    createNewUser,
    fetchValidCustomer,
  }
);
