// =========================
// Dependencies
// =========================
var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

// =========================
// Controllers
// =========================



//can now access the twilio controller if logged in
var twilioAPIController = require("./twilioAPI.js");
router.all("/twilio/", isLoggedIn, twilioAPIController);

//can now access the yelp controller if logged in
var yelpAPIController = require("./yelpAPI.js");
router.all("/yelp/*", isLoggedIn, yelpAPIController); //protects yelp route
// router.get("/yelp/index", isLoggedIn, yelpAPIController);


// =========================
// Index
// =========================
router.get("/", function(req, res) {
  // console.log("main route works");
  res.render("./user/index.ejs");
})

// =========================
// Login page
// =========================
router.get("/login", function(req, res) {
  res.render("./user/login.ejs", { message: req.flash("loginMessage")})
});

// =========================
// Post login
// =========================
// router.post('/login', passport.authenticate('local-login'),
// function(req, res) {
//   console.log("login works");
//   console.log(req.user);
//   res.redirect("/user");
// });


// // =========================
// // Post login
// // =========================
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/user/profile', // redirect to the secure profile section
  failureRedirect: '/user/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

// =========================
// Signup page
// =========================
router.get("/signup", function(req, res) {
  console.log("get signup works");
  res.render("./user/signup.ejs", {message: req.flash("signupMessage")} )
});

// =========================
// Post signup 
// =========================
// router.post("/signup", passport.authenticate("local-signup"), 
//   function(req, res) {
//     console.log("new signup route works");
//     res.redirect("/user");
// });
router.post("/signup", passport.authenticate("local-signup", {
  successRedirect: "/user/profile", // success brings you to profile page
  failureRedirect: "/user/signup", // redirects back to signup page upon failure
  failureFlash: true //allows flash message for failure
}));

// =========================
// Logout
// =========================
router.get("/logout", function(req, res) {
  console.log("logout reached");
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/user");
});

// =========================
// Main profile page
// =========================
router.get("/profile", isLoggedIn, function(req, res) {
  console.log("profile reached");
  console.log(req.body);
  var data = req.user;
  console.log(req.user);
  console.log(typeof data);
  console.log(data.local);
  res.render("./user/profile.ejs", {data:data});
});

// =========================
// Updates profile page
// =========================
router.put("/profile", isLoggedIn, function(req, res) {
  console.log("profile update reached");
  console.log(req.body);
  console.log(req.body.email);
  User.findOneAndUpdate( { email: req.body.email }, req.body, function(err, user) {
    if (err) {
      console.log(err)
    } else {
      console.log("saved");
    }
  });
});

// // =========================
// // Updates profile page
// // =========================
// router.post("/profile", isLoggedIn, function(req, res) {
//   console.log("profile update reached");
//   res.render("./user/profile.ejs", {user: req.user});
// });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// FUNCTION SECTION
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Checks if user is authenticated
function isLoggedIn(req, res, next) {
  console.log("is logged in runs");
  if (req.isAuthenticated()) {
    return next();
  } else {
  res.redirect('/user');
  }
}


module.exports = router;