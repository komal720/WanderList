
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

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
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "Listing created successfully!");

    res.redirect(`/listings/${newListing._id}`);
};

// EDIT ROUTE
module.exports.renderEditListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    res.render("listings/edit.ejs", { listing });
};

// UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body.listing,
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found!");
    }

    req.flash("success", "Listing updated successfully!");

    res.redirect(`/listings/${updatedListing._id}`);
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
