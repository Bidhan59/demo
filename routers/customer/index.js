const express = require("express");

const empRouter = express.Router();
const appRoot = require("app-root-path");

const customerController = require(`${appRoot}/controllers/customer.js`);
empRouter.post("/register", customerController.customerRegister);
empRouter.post("/login", customerController.customerLogin);
module.exports = empRouter;
