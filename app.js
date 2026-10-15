
const express = require("express");
const app = express();

const connectDB = require("./config/databases");
const Listing = require("./models/listing");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("Hii, I am Root");
});

app.get("/listing", async (req, res) => {
  try {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(7000, () => {
      console.log("Server running on port 7000");
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

startServer();
