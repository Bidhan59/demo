const appRoot = require("app-root-path");

const requiredParam = require(`${appRoot}/helpers/requiredParam`);
const collectionName = "products";

const fetchProducts = async ({
  selectionParameters = requiredParam("selectionParameters"),
  db = requiredParam("db"),
}) => {
  const products = await db
    .collection(collectionName)
    .find(selectionParameters)
    .toArray();
  return products;
};
const fetchProduct = async ({
  selectionParameters = requiredParam("selectionParameters"),
  db = requiredParam("db"),
}) => {
  const product = await db
    .collection(collectionName)
    .findOne(selectionParameters);
  return product;
};
const updateProduct = async ({
  filterObj = requiredParam("filterObj"),
  db = requiredParam("db"),
  updateParameters = requiredParam("updateParameters"),
}) => {
  const updatedProduct = await db
    .collection(collectionName)
    .findOneAndUpdate(filterObj, updateParameters);
  return updatedProduct;
};

module.exports = Object.assign(
  {},
  {
    fetchProducts,
    fetchProduct,
    updateProduct,
  }
);
