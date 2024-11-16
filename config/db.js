const mongoose=require("mongoose");
require("dotenv").config();
 function dbConnect(){
    mongoose.connect(process.env.MONGO_URI).then(res=>{
        console.log(`db connected ${res.connection.host} and running on port ${res.connection.port}`)
    }).catch(err=>{
        console.log(`error occured while connecting ${err}`)
    })
}

module.exports=dbConnect;
