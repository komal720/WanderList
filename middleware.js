
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync");

// Check whether user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in to create a listing!"
        );

        return res.redirect("/login");
    }

    next();
};

// Save redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }

    next();
};

// Check listing owner
module.exports.isOwner = wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found!");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash(
            "error",
            "You are not authorized to do that!"
        );

        return res.redirect(`/listings/${id}`);
    }

    next();
});
