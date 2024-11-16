const mongoose = require("mongoose");
const {User}=require("./user")

const bankbalanceSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const Account=mongoose.model("Account",bankbalanceSchema)

module.exports={Account}