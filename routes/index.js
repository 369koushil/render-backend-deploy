const express = require("express");
const userRoute = require("./userRoute")
const accRoute = require("./accountRoutes")


const router = express.Router();

router.use("/users", userRoute);
router.use("/accounts", accRoute)
router.get("/alive",(req,res)=>{
 console.log("alive");
 return res.status(200).json({
    msg:"backend is alive"
 })
})
module.exports = router
