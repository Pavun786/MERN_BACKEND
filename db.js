const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async() =>{
    try{
       
        await mongoose.connect(process.env.Mongo_Url)
       
        console.log("Db connected successfuly")
    
    }catch(error){
     
        console.log(error)
    }
}

module.exports = connectDb