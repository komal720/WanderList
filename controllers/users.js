
const User = require("../models/user.js");

// SIGNUP FORM
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// REGISTER USER
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            req.flash("error", "All fields are required.");
            return res.redirect("/signup");
        }

        const newUser = new User({
            username,
            email
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });
    } catch (err) {
        if (err.name === "UserExistsError" || err.code === 11000) {
            req.flash("error", "Username or email may already be registered.");
            return res.redirect("/signup");
        }

        if (err.name === "ValidationError") {
            req.flash("error", err.message);
            return res.redirect("/signup");
        }

        next(err);
    }
};

// LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// LOGOUT
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
