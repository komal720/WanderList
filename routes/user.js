
const express = require("express");
const router = express.Router();

const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");

const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// SIGNUP
router.get("/signup", userController.renderSignupForm);

router.post(
    "/signup",
    wrapAsync(userController.signup)
);

// LOGIN FORM
router.get("/login", userController.renderLoginForm);

// LOGIN SUBMIT
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        const redirectUrl = res.locals.redirectUrl || "/listings";

        req.flash("success", "Welcome back to WanderLust!");
        res.redirect(redirectUrl);
    }
);

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;
