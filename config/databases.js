
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.SECRET;

        if (!uri) {
            throw new Error("MongoDB connection string (SECRET) is missing");
        }

        await mongoose.connect(uri);

        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
