
const express = require("express");
const router = express.Router();

const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");

const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// SIGNUP FORM
router.get(
    "/signup",
    userController.renderSignupForm
);

// SIGNUP ROUTE
router.post(
    "/signup",
    wrapAsync(userController.signup)
);

// LOGIN FORM
router.get(
    "/login",
    userController.renderLoginForm
);

// LOGIN ROUTE
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Invalid username or password."
    }),
    (req, res) => {
        const redirectUrl =
            res.locals.redirectUrl || "/listings";

        req.flash("success", "Welcome back to WanderLust!");

        res.redirect(redirectUrl);
    }
);

// LOGOUT ROUTE
router.get(
    "/logout",
    userController.logout
);

module.exports = router;
