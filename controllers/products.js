const _ = require("lodash");
const root = require("app-root-path");
const isError = require(`${root}/helpers/isError`);
const productModel = require(`${root}/models/products`);

async function fetchProducts(req, res, next) {
  const orgDB = req.db.demo;
  let selectionParameters = {
    quantity: { $gte: 0 },
  };
  if (req.query.productName) {
    selectionParameters["productName"] = {
      //$regex: `^${req.query.text.trim()}.`,
      $regex: req.query.productName,
      $options: "i",
    };
  }
  const products = await productModel
    .fetchProducts({
      selectionParameters: selectionParameters,
      db: orgDB,
    })
    .catch((err) => {
      const error = err;
      error.status = 500;
      return error;
    });
  if (isError(products)) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Error in fetching the products",
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    data: products,
  });
}

async function fetchProduct(req, res, next) {
  const orgDB = req.db.demo;
  if (!req.params.productId) {
    return res.status(404).json({
      status: "success",
      statusCode: 404,
      data: "ProductId is compulsory",
    });
  }
  let selectionParameters = {
    productId: parseInt(req.params.productId),
  };
  const products = await productModel
    .fetchProduct({
      selectionParameters: selectionParameters,
      db: orgDB,
    })
    .catch((err) => {
      const error = err;
      error.status = 500;
      return error;
    });
  if (isError(products)) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Error in fetching the product",
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    data: products,
  });
}

module.exports = { fetchProducts: fetchProducts, fetchProduct: fetchProduct };
