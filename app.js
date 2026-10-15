
const express = require("express");
const app = express();

const connectDB = require("./config/databases");
const Listing = require("./models/listing");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
  res.send("Hii, I am Root");
});


//index route
app.get("/listing", async (req, res) => {
  try {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
});



//show route 

app.get("/listing/:id",async (req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findById(id);
  res.render("listing/show.ejs",{listing});


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
