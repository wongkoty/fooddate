// =========================
// Dependencies
// =========================
var passport = require('passport');
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user.js");
var Friends = require("../models/friends.js");

module.exports = function(passport) {

  //serializes user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id); //adds an ID to the session
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
    // console.log("this is req.body.first_name " + req.body.first_name)
    // console.log("this is the req.body.last_name " + req.body.last_name);
    // console.log("this is the req.body.phone_number " + req.body.phone_number);
    // console.log("this is the req.body.email " + req.body.email);
    // console.log("this is the req.body.password " + req.body.password);
    // console.log("this is the req.body.password2 " + req.body.password2);
    // console.log("====================================");

    req.checkBody("first_name", "First name is required").notEmpty();
    req.checkBody("last_name", "Last name is required").notEmpty();
    req.checkBody("phone_number", "Invalid phone number").notEmpty().isInt();
    // req.checkBody("phone_number", "Phone Number is not a number");
    req.checkBody('email', 'An email is required').notEmpty()
    req.checkBody('email', 'A valid email is required').isEmail();
    req.checkBody("password", "Password is required").notEmpty();
    req.checkBody("password", "Password is too short").len(6);
    req.checkBody("password2", "Passwords don't match").equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){  //checks for errors
      // console.log("these are the errors " + errors)
      console.log(errors[0].msg);
      // console.log(typeof errors);
      // return done(res.render("/user/signup", {message: req.flash(errors)});
      return done(null, false, req.flash("signupMessage", errors));
    }

    process.nextTick(function() {

      User.findOne({ "local.email": email }, function(err, user) {
        console.log(user);
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
          var newFriends = new Friends();


          console.log(newUser);
          console.log(email);
          // console.log(phone_number);
          console.log(req.body.first_name);
          newUser.first_name = req.body.first_name;
          newUser.last_name = req.body.last_name;
          newUser.phone_number = req.body.phone_number;
          newFriends.first_name = req.body.first_name;
          newFriends.last_name = req.body.last_name;
          newFriends.phone_number = req.body.phone_number;
          // newUser.first_name = first_name;
          // newUser.last_name = last_name;
          // newUser.phone_number = phone_number;
          newUser.local.email = email;
          newFriends.email = email;
          console.log(newUser);
          // console.log(newUser.generateHash(password));
          newUser.local.password = newUser.generateHash(password);
          console.log(newUser.local.password);
          
          newFriends.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("new friend saved");
            }
          });

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