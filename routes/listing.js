
const express = require("express");
const router = express.Router();
const multer = require("multer");

const { storage } = require("../cloudConfig.js");

const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const upload = multer({ storage });

// VALIDATE LISTING MIDDLEWARE
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        return next(new ExpressError(400, error.message));
    }

    next();
};

// INDEX + CREATE ROUTES

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// NEW ROUTE
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

// SHOW + UPDATE + DELETE ROUTES
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing)
    );

// EDIT ROUTE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditListing)
);

module.exports = router;
