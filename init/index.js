
const connectDB = require("../config/databases");
const initData = require("./data");
const Listing = require("../models/listing");
const mongoose = require("mongoose");

const initDB = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Delete all existing listings
        await Listing.deleteMany({});

        // Assign owner ID to every listing
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "6ad673d8a930944443e89104"
        }));

        // Insert sample listings into database
        await Listing.insertMany(initData.data);

        console.log("Data was initialized successfully!");
    } catch (err) {
        console.error("Initialization failed:", err);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
    }
};

// Execute the function
initDB();
