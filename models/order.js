const appRoot = require("app-root-path");

const requiredParam = require(`${appRoot}/helpers/requiredParam`);
const collectionName = "orders";

const fetchOrders = async ({
  selectionParameters = requiredParam("selectionParameters"),
  db = requiredParam("db"),
}) => {
  const orders = await db
    .collection(collectionName)
    .find(selectionParameters)
    .toArray();
  return orders;
};
const fetchOrder = async ({
  selectionParameters = requiredParam("selectionParameters"),
  db = requiredParam("db"),
}) => {
  const order = await db
    .collection(collectionName)
    .find(selectionParameters)
    .toArray();
  return order;
};
const createOrder = async ({
  order = requiredParam("order"),
  db = requiredParam("db"),
}) => {
  var bulk = await db.collection(collectionName).initializeUnorderedBulkOp();
  order.forEach((p) => {
    bulk.insert(p);
  });
  bulk.execute();
};
const updateOrder = async ({
  filterObj = requiredParam("filterObj"),
  db = requiredParam("db"),
  updateParameters = requiredParam("updateParameters"),
}) => {
  const updatedOrder = await db
    .collection(collectionName)
    .findOneAndUpdate(filterObj, updateParameters);
  return updatedOrder;
};
module.exports = Object.assign(
  {},
  {
    fetchOrders,
    fetchOrder,
    createOrder,
    updateOrder,
  }
);
