const appRoot = require("app-root-path");

const requiredParam = require(`${appRoot}/helpers/requiredParam`);
const collectionName = "suppliers";

const fetchSuppliers = async ({
  selectionParameters = requiredParam("selectionParameters"),
  db = requiredParam("db"),
}) => {
  const suppliers = await db
    .collection(collectionName)
    .find(selectionParameters)
    .toArray();
  return suppliers;
};
const fetchSupplier = async ({
  selectionParameters = requiredParam("selectionParameters"),
  db = requiredParam("db"),
}) => {
  const supplier = await db
    .collection(collectionName)
    .findOne(selectionParameters);
  return supplier;
};

// const updateSupplier = async ({
//   suppliers = requiredParam("suppliers"),
//   db = requiredParam("db"),
// }) => {
//   const supplier = await db
//     .collection(collectionName)
//     .updateOne(selectionParameters);
//   return supplier;
// };
const updateSupplier = async ({
  filterObj = requiredParam("filterObj"),
  db = requiredParam("db"),
  updateParameters = requiredParam("updateParameters"),
}) => {
  const updatedSupplier = await db
    .collection(collectionName)
    .findOneAndUpdate(filterObj, updateParameters);
  return updatedSupplier;
};

module.exports = Object.assign(
  {},
  {
    fetchSuppliers,
    fetchSupplier,
    updateSupplier,
  }
);
