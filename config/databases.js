
const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.ATLASDB_URL;

    await mongoose.connect(uri);

    console.log("MongoDB connected successfully");
};

module.exports = connectDB;
