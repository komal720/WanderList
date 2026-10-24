if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}




const express = require("express");
const app = express();
const path = require("path");

const connectDB = require("./config/databases");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const ExpressError = require("./utils/ExpressError.js");

// Separate Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// EJS Configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session Configuration
const sessionOptions = {
    secret: process.env.SECRET || "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

// Session and Flash
app.use(session(sessionOptions));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make Flash Messages and Current User Available in EJS
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Root Route
app.get("/", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
});

// Mount Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Middleware
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";

    res.status(statusCode).render("error.ejs", {
        message,
        statusCode
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
