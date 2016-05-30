// =========================
// Dependencies
// =========================
var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// FUNCTION SECTION
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Checks if user is authenticated


// =========================
// Index
// =========================
router.get("/", function(req, res) {
  // console.log("main route works");
  res.render("index.ejs");
})

// =========================
// Login page
// =========================
router.get("/login", function(req, res) {
  res.render("login.ejs", { message: req.flash("loginmessage")})
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
  successRedirect: '/user', // redirect to the secure profile section
  failureRedirect: '/user/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

// =========================
// Signup page
// =========================
router.get("/signup", function(req, res) {
  console.log("get signup works");
  res.render("signup.ejs", {message: req.flash("signup message")} )
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
// Main profile page
// =========================
router.get("/profile", function(req, res) {
  console.log("profile reached");
  res.render("profile.ejs", {user: req.user});
});

// =========================
// Logout
// =========================
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
  res.redirect('/');
  }
}


module.exports = router;