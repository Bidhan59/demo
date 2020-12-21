const express = require("express");

const empRouter = express.Router();
const appRoot = require("app-root-path");

const productsController = require(`${appRoot}/controllers/products.js`);
empRouter.get("/products", productsController.fetchProducts);
empRouter.get("/products/:productId", productsController.fetchProduct);
module.exports = empRouter;
