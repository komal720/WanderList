
    
 
const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =  "mongodb+srv://komalpandey0318_db_user:komal@cluster0.jutkxdv.mongodb.net/wanderlist";

  await mongoose.connect(uri);

  console.log("MongoDB connected successfully");
};

module.exports = connectDB;
