
const express = require("express");
const app = express();

const connectDB = require("./config/databases");
const Listing = require("./models/listing");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

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

// Validate Listing Middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listing);

    if (error) {
        return next(new ExpressError(400, error.message));
    }

    next();
};

// Index Route
app.get(
    "/listings",
    wrapAsync(async (req, res) => {
        const allListing = await Listing.find({});
        res.render("listings/index.ejs", { allListing });
    })
);

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create Route
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);

        await newListing.save();

        res.redirect("/listings");
    })
);

// Edit Route
app.get(
    "/listings/:id/edit",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        res.render("listings/edit.ejs", { listing });
    })
);

// Update Route
app.put(
    "/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            req.body.listing,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedListing) {
            throw new ExpressError(404, "Listing not found");
        }

        res.redirect(`/listings/${id}`);
    })
);

// Show Route
app.get(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        res.render("listings/show.ejs", { listing });
    })
);

// Delete Route
app.delete(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            throw new ExpressError(404, "Listing not found");
        }

        res.redirect("/listings");
    })
);

// 404 Middleware
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";

    res.status(statusCode).render("error.ejs", {
        message
    });
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
