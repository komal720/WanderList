
const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// VALIDATE REVIEW
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        return next(new ExpressError(400, error.message));
    }

    next();
};

// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// DELETE REVIEW
router.delete(
    "/:reviewId",
    isLoggedIn,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;
