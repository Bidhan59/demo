const _ = require("lodash");
const root = require("app-root-path");
const isError = require(`${root}/helpers/isError`);
const orderModel = require(`${root}/models/order`);
const customerModel = require(`${root}/models/customer.js`);
const supplierModel = require(`${root}/models/supplier.js`);
const productModel = require(`${root}/models/products`);
const uuidV4 = require("uuid/v4");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

async function fetchOrders(req, res, next) {
  const orgDB = req.db.demo;
  let selectionParameters = {};
  let token = req.headers.authorization;
  if (!token) {
    return res.status(404).json({
      status: "success",
      statusCode: 404,
      data: "Please login to continue",
    });
  }
  var decoded = jwt.verify(token, "password");
  if (!decoded) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Please login to continue",
    });
  }
  let customerSelection = {
    customerId: decoded.id,
  };
  const validUser = await customerModel
    .fetchValidCustomer({
      selectionParameters: customerSelection,
      db: orgDB,
    })
    .catch((err) => {
      const error = err;
      error.status = 500;
      return error;
    });
  if (isError(validUser)) {
    return res.status(403).json({
      status: "success",
      statusCode: 403,
      data: "Error in fetching the order",
    });
  }
  if (!validUser) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Not a valid user, please login to continue",
    });
  }
  selectionParameters = {
    "customerDetails.customerId": decoded.id,
  };
  if (req.query.ordered == 1) {
    selectionParameters = {
      payment: true,
      delivered: false,
    };
  }
  if (req.query.ordered == 0) {
    selectionParameters = {
      payment: false,
      delivered: false,
    };
  }
  const orders = await orderModel
    .fetchOrders({
      selectionParameters: selectionParameters,
      db: orgDB,
    })
    .catch((err) => {
      const error = err;
      error.status = 500;
      return error;
    });
  if (isError(orders)) {
    return res.status(403).json({
      status: "success",
      statusCode: 403,
      data: "Error in fetching the order",
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    data: orders,
  });
}

async function fetchOrder(req, res, next) {
  const orgDB = req.db.demo;
  let selectionParameters = {
    orderId: req.query.orderId,
  };
  let token = req.headers.authorization;
  if (!token) {
    return res.status(404).json({
      status: "success",
      statusCode: 404,
      data: "Please login to continue",
    });
  }
  var decoded = jwt.verify(token, "password");
  if (!decoded) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Please login to continue",
    });
  }
  let customerSelection = {
    customerId: decoded.id,
  };
  const validUser = await customerModel
    .fetchValidCustomer({
      selectionParameters: customerSelection,
      db: orgDB,
    })
    .catch((err) => {
      const error = err;
      error.status = 500;
      return error;
    });
  if (isError(validUser)) {
    return res.status(403).json({
      status: "success",
      statusCode: 403,
      data: "Error in fetching the order",
    });
  }
  if (!validUser) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Not a valid user, please login to continue",
    });
  }
  const order = await orderModel
    .fetchOrder({
      selectionParameters: selectionParameters,
      db: orgDB,
    })
    .catch((err) => {
      const error = err;
      error.status = 500;
      return error;
    });
  if (isError(order)) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Error in fetching the order",
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    data: order,
  });
}

async function createOrder(req, res, next) {
  const orgDB = req.db.demo;
  let body = req.body.data;
  let orderId = null;
  let token = req.headers.authorization;
  if (!token) {
    return res.status(404).json({
      status: "success",
      statusCode: 404,
      data: "Please login to continue",
    });
  }
  let decoded = null;
  try {
    decoded = jwt.verify(token, "password");
  } catch (err) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Please login to continue",
    });
  }
  if (_.isNil(decoded)) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Please login to continue",
    });
  }
  let customerSelection = {
    customerId: decoded.id,
  };

  const validUser = await customerModel
    .fetchValidCustomer({
      selectionParameters: customerSelection,
      db: orgDB,
    })
    .catch((err) => {
      const error = err;
      error.status = 500;
      return error;
    });
  if (isError(validUser)) {
    return res.status(403).json({
      status: "success",
      statusCode: 403,
      data: "Error in fetching the order",
    });
  }
  if (!validUser) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Not a valid user, please login to continue",
    });
  }
  const customer = validUser;
  if (req.body.orderId) {
    orderId = req.body.orderId;
    await orderModel
      .updateOrder({
        filterObj: { orderId: req.body.orderId },
        db: orgDB,
        updateParameters: { $set: { payment: req.body.payment } },
      })
      .catch((err) => {
        const error = err;
        error.status = 500;
        return error;
      });
  } else {
    orderId = uuidV4();
    let arr = [];
    body.forEach((b) => {
      let obj = {
        orderId: orderId,
        productId: b.productId,
        productName: b.productName,
        quantity: b.quantity,
        customerDetails: {
          customerId: customer.customerId,
          customerName: customer.displayName,
          customerAddress: customer.address,
          customerZipcode: customer.zipcode,
          customerPhoneNo: customer.phoneNumber,
        },
        supplierDetails: {
          supplierId: b.supplierId,
          supplierName: b.supplierName,
          supplierCity: b.supplierCity,
          supplierPhoneNo: b.supplierPhoneNo,
        },
        payment: req.body.payment,
        delivered: false,
      };
      arr.push(obj);
    });
    const order = await orderModel
      .createOrder({
        order: arr,
        db: orgDB,
      })
      .catch((err) => {
        const error = err;
        error.status = 500;
        return error;
      });
    if (isError(order)) {
      return res.status(403).json({
        status: "success",
        statusCode: 403,
        data: "Error while ordering",
      });
    }
    if (req.body.payment == true) {
      for (let i in body) {
        let selectionParameters = {
          productId: body[i].productId,
        };
        const product = await productModel
          .fetchProduct({
            selectionParameters: selectionParameters,
            db: orgDB,
          })
          .catch((err) => {
            const error = err;
            error.status = 500;
            return error;
          });
        if (isError(product)) {
          return next(product);
        }
        let remainingQuantity = product.quantity - body[i].quantity;
        await productModel
          .updateProduct({
            filterObj: selectionParameters,
            db: orgDB,
            updateParameters: { $set: { quantity: remainingQuantity } },
          })
          .catch((err) => {
            const error = err;
            error.status = 500;
            return error;
          });
      }
    }
  }
  if (req.body.payment == true) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "noreplyshoppingportal@gmail.com",
        pass: "stayfit2020@",
      },
    });

    var mailOptions = {
      from: "noreplyshoppingportal@gmail.com",
      to: customer["email"],
      subject: "Shopping Portal Login Credentials",
      text: `Your order is placed and your orderId is ${orderId}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    orderId: orderId,
  });
}

module.exports = {
  fetchOrders: fetchOrders,
  fetchOrder: fetchOrder,
  createOrder: createOrder,
};
