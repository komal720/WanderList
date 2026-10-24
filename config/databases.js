
const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.ATLASDB_URL;

    if (!uri) {
        throw new Error("ATLASDB_URL is missing from environment variables");
    }

    await mongoose.connect(uri);

    console.log("MongoDB connected successfully");
};

module.exports = connectDB;
