
const connectDB = require("../config/databases");
const initData = require("./data");
const Listing = require("../models/listing");

const initDB = async () => {
  try {
    await connectDB();

    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);

    console.log("Data was initialized");
  } catch (err) {
    console.error("Initialization failed:", err);
  } finally {
    const mongoose = require("mongoose");
    await mongoose.connection.close();
  }
};

initDB();
