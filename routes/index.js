const express = require("express");
const userRoute = require("./userRoute")
const accRoute = require("./accountRoutes")


const router = express.Router();

router.use("/users", userRoute);
router.use("/accounts", accRoute)

module.exports = router