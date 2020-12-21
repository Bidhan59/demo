const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");
const root = require("app-root-path");
const isError = require(`${root}/helpers/isError`);
const customerModel = require(`${root}/models/customer.js`);
const uuidV4 = require("uuid/v4");
const generator = require("generate-password");
const nodemailer = require("nodemailer");

async function customerRegister(req, res, next) {
  const orgDB = req.db.demo;
  let id = uuidV4();
  let obj = {
    customerId: id,
    firstName: req.body.name.split(" ")[0],
    lastName: req.body.name.split(" ")[1] ? req.body.name.split(" ")[1] : null,
    displayName: req.body.name,
    email: req.body.emailAdress,
    address: req.body.address ? req.body.address : null,
    zipcode: req.body.zipcode ? req.body.zipcode : null,
    city: req.body.city ? req.body.city : null,
    state: req.body.state ? req.body.state : null,
    phoneNumber: req.body.phoneNo ? req.body.phoneNo : null,
    password: generator.generate({
      length: 10,
      numbers: true,
    }),
  };
  const user = await customerModel
    .createNewUser({
      user: obj,
      db: orgDB,
    })
    .catch((err) => {
      const error = err;
      error.status = 500;
      return error;
    });
  if (isError(user)) {
    return res.status(403).json({
      status: "success",
      statusCode: 403,
      data: "Error in registering the user",
    });
  }
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
    to: obj["email"],
    subject: "Shopping Portal Login Credentials",
    text: `you can login through userId ${id} and password ${obj.password}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  // if (err)
  //   return res.status(500).send("There was a problem registering the user.");
  // create a token
  //   var token = jwt.sign({ id: user._id }, secret, {
  //     expiresIn: 86400, // expires in 24 hours
  //   });
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    data: `Your user Id is ${id}`,
  });
}

async function customerLogin(req, res, next) {
  const orgDB = req.db.demo;
  let id = uuidV4();
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      status: "success",
      statusCode: 400,
      data: "Username and Password is mandetory",
    });
  }
  let selectionParameters = {
    email: req.body.username,
    password: req.body.password,
  };
  const customer = await customerModel
    .fetchValidCustomer({
      selectionParameters: selectionParameters,
      db: orgDB,
    })
    .catch((err) => {
      const error = err;
      error.status = 500;
      return error;
    });
  if (isError(customer)) {
    return next(customer);
  }
  if (!customer) {
    return res.status(403).json({
      status: "success",
      statusCode: 403,
      data: "Invalid Credentials",
    });
  }
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
    to: "sarkarbidhan59@gmail.com",
    subject: "Shopping Portal Login",
    text: `Your shopping portal account has been recently logged in`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  //create a token
  var token = jwt.sign({ id: customer.customerId }, "password", {
    expiresIn: 86400, // expires in 24 hours
  });
  customer["token"] = token;
  return res.status(200).json({
    status: "success",
    statusCode: 200,
    data: customer,
  });
}
module.exports = {
  customerRegister: customerRegister,
  customerLogin: customerLogin,
};
