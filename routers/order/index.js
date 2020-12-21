const express = require("express");

const empRouter = express.Router();
const appRoot = require("app-root-path");

const orderController = require(`${appRoot}/controllers/order.js`);
empRouter.post("/products", orderController.createOrder);
empRouter.get("/details", orderController.fetchOrders);
empRouter.get("/detail", orderController.fetchOrder);
module.exports = empRouter;
