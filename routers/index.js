const express = require("express");

const router = express.Router();

const router1 = require("./products");
const router2 = require("./customer");
const router3 = require("./order");

router.use("/shopping", router1);
router.use("/customer", router2);
router.use("/order", router3);
// router.use("/user", router2);
// router.use("/calculate", router3);
// router.use("/manager", router4);
// router.use("/users", router5);
// router.use("/dashboard", router6);
// router.use("/cancel", router7);
// router.use("/summary", router8);
// router.use("/approval", router9);
// router.use("/calendar", teamCalendar);
// router.use("/update", router11);
// router.use("/fetch", router12);
// router.use("/get", router13);
// router.use("/hrbp", router14);
// router.use("/year", router15);
// router.use("/generate", router16);

module.exports = router;
