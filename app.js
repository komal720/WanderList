
const express = require("express");
const app = express();

const connectDB = require("./config/databases");
const Listing = require("./models/listing");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// EJS Configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Root Route
app.get("/", (req, res) => {
    res.send("Hii, I am Root");
});

// Index Route
app.get("/listings", async (req, res) => {
    try {
        const allListing = await Listing.find({});
        res.render("listings/index.ejs", { allListing });
    } catch (err) {
        console.error("INDEX ERROR:", err);
        res.status(500).send("Error fetching listings");
    }
});

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create Route
app.post("/listings", async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();

        res.redirect("/listings");
    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(500).send("Error creating listing");
    }
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        console.error("EDIT ERROR:", err);
        res.status(500).send("Error fetching listing");
    }
});

// Update Route
app.put("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { listing } = req.body;

        if (!listing) {
            return res.status(400).send("Listing data is missing");
        }

        const updateData = { ...listing };

        // Handle image URL if provided
        if (listing.image && listing.image.url) {
            updateData.image = {
                filename: "listingimage",
                url: listing.image.url
            };
        }

        await Listing.findByIdAndUpdate(id, updateData, {
            runValidators: true
        });

        // Redirect to the correct Show Route
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).send("Error updating listing");
    }
});

// Show Route
app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error("SHOW ERROR:", err);
        res.status(500).send("Error fetching listing");
    }
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await Listing.findByIdAndDelete(id);

        res.redirect("/listings");
    } catch (err) {
        console.error("DELETE ERROR:", err);
        res.status(500).send("Error deleting listing");
    }
});

// Start Server
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
