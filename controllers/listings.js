const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const ExpressError = require("../utils/ExpressError.js");

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN
});

// INDEX ROUTE
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
};

// NEW ROUTE
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// SHOW ROUTE
module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                model: "User"
            }
        });

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("listings/show.ejs", { listing });
};

// CREATE ROUTE
// CREATE ROUTE
module.exports.createListing = async (req, res) => {
    if (!req.file) {
        throw new ExpressError(400, "Please upload a listing image!");
    }

    const { title, description, price, country, location } =
        req.body.listing;

    const response = await geocodingClient
        .forwardGeocode({
            query: `${location}, ${country}`,
            limit: 1
        })
        .send();

    const newListing = new Listing({
        title,
        description,
        price,
        country,
        location,
        owner: req.user._id,
        image: {
            url: req.file.path,
            filename: req.file.filename
        }
    });

    if (response.body.features.length > 0) {
        newListing.geometry = response.body.features[0].geometry;
    }

    await newListing.save();

    req.flash("success", "Listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
};

// EDIT FORM
module.exports.renderEditListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("listings/edit.ejs", { listing });
};

// UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    const { title, description, price, country, location } =
        req.body.listing;

    const response = await geocodingClient
        .forwardGeocode({
            query: `${location}, ${country}`,
            limit: 1
        })
        .send();

    Object.assign(listing, {
        title,
        description,
        price,
        country,
        location
    });

    if (response.body.features.length > 0) {
        listing.geometry = response.body.features[0].geometry;
    }

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
};

// DELETE ROUTE
module.exports.deleteListing = async (req, res) => {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);

    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found!");
    }

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
