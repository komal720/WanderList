
const express = require("express");
const router = express.Router();

const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Validate Listing Middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        return next(new ExpressError(400, error.message));
    }

    next();
};

// INDEX ROUTE
router.get(
    "/",
    wrapAsync(listingController.index)
);

// NEW ROUTE
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

// CREATE ROUTE
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
);

// EDIT ROUTE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditListing)
);

// UPDATE ROUTE
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
);

// SHOW ROUTE
router.get(
    "/:id",
    wrapAsync(listingController.showListing)
);

// DELETE ROUTE
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

module.exports = router;
