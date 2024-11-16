const express=require("express");
const cors=require("cors");
const mainRouter=require("./routes/index")
const dbConnect=require("./config/db")
require("dotenv").config()
const port=process.env.PORT;
dbConnect();

const app=express();
app.use(cors());
app.use(express.json())
app.use("/api/v1",mainRouter)


app.listen(port,()=>{
    console.log(`running on ${port}`)
});