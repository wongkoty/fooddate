// =========================
// Dependencies
// =========================
var passport = require('passport');
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user.js");

module.exports = function(passport) {

  //serializes user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //deserialize user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

// =========================
// local signup
// =========================
  passport.use("local-signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true // passes entire request to callback
  }, 
  function(req, email, password, done) {

    process.nextTick(function() {

      User.findOne({ "local.email": email }, function(err, user) {
        if (err) {
          console.log("there is an error!");
          return done(err); //checks for an error in email
        }
        if (user) { //if user exist, returns flash message
          console.log("email already taken");
          return done(null, false, req.flash("signupMessage", "That email is already taken."));
        } else { //if not, creates new user. Calls model method to hash password
          console.log("no email used yet!");
          var newUser = new User();
          // console.log(newUser);
          newUser.local.email = email;
          console.log(newUser);
          // console.log(newUser.generateHash(password));
          newUser.local.password = newUser.generateHash(password);
          console.log(newUser.local.password);

          newUser.save(function(err) {
            if (err) {
              throw err;
            } else {
              return done(null, newUser);
            }
          });
        }
      });
    });
  }));

  // =========================
  // Local login
  // =========================
  passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true // passes entire request to callback
  }, 
  function(req, email, password, done) {
    process.nextTick(function() {

      User.findOne({ "local.email": email}, function(err, user) {
        console.log(user);
        if (err) {
          console.log("there is an error");
          return done(err);
        }
        if (!user) {
          console.log("no user exists");
          return done(null, false, req.flash("loginMessage", "Invalid email or password"));
        }
        if (!user.validPassword(password, user.local.password)) {
          console.log("wrong password");
          return done(null, false, req.flash("loginMessage", "Invalid email or password"));
        }
        return done(null, user);
      });
    });
  }));

};