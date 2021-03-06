// =========================
// Dependencies
// =========================
var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var Friends = require("../models/friends.js");
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

// // =====================================
// // Facebook Login
// // =====================================
// router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }))

// // =====================================
// // Facebook Callback
// // =====================================
// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {
//       successRedirect : '/',
//       failureRedirect : '/user/login'
//   }));

// =========================
// Login page
// =========================
router.get("/login", function(req, res) {
  console.log(req.user)
  if (req.user == null) {
    res.render("./user/login.ejs", { message: req.flash("loginMessage")});
  } else {
    res.redirect("/user");
  }
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


// =========================
// Post login
// =========================
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/user/', // redirect to the secure profile section
  failureRedirect: '/user/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

//  // send to facebook to do the authentication
// router.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

// // handle the callback after facebook has authorized the user
// router.get('/connect/facebook/callback',
//   passport.authorize('facebook', {
//       successRedirect : '/',
//       failureRedirect : '/user/login'
//   }));

// =========================
// Signup page
// =========================
router.get("/signup", function(req, res) {
  console.log("get signup page route");
  res.render("./user/signup.ejs", { message: req.flash("signupMessage")});
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
  successRedirect: "/user", // success brings you to profile page
  failureRedirect: "/user/signup", // redirects back to signup page upon failure
  failureFlash: true //allows flash message for failure
}));

// =========================
// Logout
// =========================
router.get("/logout", function(req, res) {
  console.log("logout reached");
  req.logout();
  // req.flash("success_msg", "You are logged out");
  res.redirect("/");
});

// =========================
// Main profile page
// =========================
router.get("/", isLoggedIn, function(req, res) {
  console.log("profile reached");
  console.log(req.body);
  var data = req.user;
  console.log(req.user);
  console.log(typeof data);
  console.log(data.local);
  res.render("./user/profile.ejs", {data:data});
});

// =========================
// Add Friend page
// =========================
router.get("/add", isLoggedIn, function(req, res) {
  console.log("add friend route reached");
  res.render("./user/addfriend.ejs");
});

// =========================
// Search for friend
// =========================
router.post("/add", isLoggedIn, function(req, res) {
  console.log("post friend route reached");
  // console.log(req.body.email);
  console.log(req.session.id);
  console.log(req.user);
  Friends.findOne({"email": req.body.email}).then(function(friend) {
    console.log(friend);
    User.findOne({_id: req.user.id}).then(function(user) {
      console.log(user);
      user.friends.push({friends: friend});
      user.save();
    });
  });
});

// =========================
// Edit profile page
// =========================
router.get("/edit", isLoggedIn, function(req, res) {
  console.log("edit profile reached");
  console.log(req.body);
  var data = req.user;
  console.log(req.user);
  console.log(typeof data);
  console.log(data.local);
  res.render("./user/editprofile.ejs", {data:data});
});


// =========================
// Updates profile page
// =========================
router.put("/profile/:id", isLoggedIn, function(req, res) {
  console.log("profile update reached");
  console.log(req.body);
  // console.log(req.body.email);
  User.findOneAndUpdate( {_id: req.params.id }, req.body, function(err, user) {
    if (err) {
      console.log(err)
    } else {
      console.log("saved");
    }
  });
  res.redirect("/user/");
});




// =========================
// DELETE PROFILE
// =========================
router.delete('/profile/:id', function(req, res) {
  // console.log("delete route works");
  console.log('deleting ' + req.params.id);
  User.remove({_id: req.params.id}).exec();

  res.redirect("/");
});

router.get('*', function(req, res){
  // res.send('what???', 404);
  res.render("./user/freg.ejs")
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
  console.log("isloggedin method runs");
  if (req.isAuthenticated()) {
    return next();
  } else {
  res.redirect('/');
  }
}


module.exports = router;



// ==============================
// JUNK
// ==============================


// ==============================
// Was trying very hard to send back errors for incorrect validation fields
// tried multiple things, but have to scrap for now 
// ==============================

// // posts index page
// router.post("/index", categoryCtrl, homeCtrl);
// // {
// //   // console.log("post route works");
// //   console.log(req.body);
// //   yelp.search({ term: 'food', limit: 3, location: req.body.location}).then(function (data) {
// //     console.log(data);
// //     // res.json(data);
// //     res.render("index.ejs", {data}); //sends down json of returned search by user parameters
// //   }).catch(function (err) {
// //     console.error(err);
// // });
// // };

// router.get("/userform", function(req, res, next) {
//   console.log("userform works");
//   res.render("userform.ejs", { title: "form validation", success: false, errors: req.session.errors});
//   req.session.errors = null;
// });

// // router.post("/index/user", function(req, res, next){
// //   console.log("user route works");
// // });

// router.get("/testroute", function(req, res, next) {
//   console.log('testroute works');
//   res.render("test.ejs", { title: "form validation", success: false, errors: req.session.errors});
//   req.session.errors = null;
// })


// router.post("/index/user", function(req, res, next){
//   console.log("user route works");
//   // var user = new User(req.body);

//   // user.save(function(err) {
//   //   assert.equal(error.errors['name'].message,
//   //     'Path `name` is required.');

//   //   error = user.validateSync();
//   //   assert.equal(error.errors['name'].message,
//   //     'Path `name` is required.');
//   req.check("email", "invalid e-mail").isEmail();
//   req.check("first_name", "Password is invalid").isLength({min: 4});

//   var errors = req.validationErrors();
//   if (errors) {
//     req.session.errors = errors;
//   } else {
//     res.redirect("/testroute");
//     console.log("yay")
//   }

//     // if(err) {
//     //   console.log(err);

//     //   // prompt("require e-mail");
//     //   // res.status(500).send('Something broke!');
//     // } else {
//     //   console.log('New instance saved');
//     //   res.send(user)
//   // })

//    // var cat = new Cat();
//    //  cat.save(function(error) {
//    //    assert.equal(error.errors['name'].message,
//    //      'Path `name` is required.');

//    //    error = cat.validateSync();
//    //    assert.equal(error.errors['name'].message,
//    //      'Path `name` is required.');
//    //  });
  

// });

// function homeCtrl(req, res) {
//   console.log("test homeCtrl");
//   console.log(req.body);

//   // res.render("index.ejs");
//   // Prepare the context
//   var data = req.dataProcessed;
//   console.log(data);
//   res.render('index.ejs', {data});
// }

// function categoryCtrl(req, res, next) {
//   console.log("test category Ctrl");
//   console.log(req.body);
//   console.log(req.body.category_filter)
//     // Process the data received in req.body
//     // instead of res.redirect('/');
//     yelp.search({ term: req.body.term, limit: 5, category_filter: req.body.category_filter, location: req.body.location}).then(function (data) {
//       console.log(data);
//       // res.json(data);
//       req.dataProcessed = data;
//       return next();
//       // res.render("index.ejs", {data}); //sends down json of returned search by user parameters
//     });
//     // .catch(function (err) {
//     //   console.error(err);
//     // });
   
//     // optionally - Same effect
//     // accept no need to define homeCtrl
//     // as the last piece of middleware
//     // return homeCtrl(req, res, next);
// }

// ==============================
// user sign up
// ==============================
// router.get("/sign_up", function(req, res) {
//   console.log("sign up page works");  
//   res.render("sign_up.ejs");
// });

// ==============================
// Login
// ==============================
// router.get("/login", function(req, res) {
//   console.log("login page works");  
//   res.render("login.ejs");
// });

// ==============================
// save new user
// ==============================
// router.post("/sign_up", function(req, res) {
//   console.log("sign up success route");
//   console.log(req.body);
//   var user = new User(req.body);
//   user.save(function(err, req) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("saved");
//     }
//   })
//   res.redirect("/");
// })

// app.post('/category', categoryCtrl, homeCtrl);


// router.get("/index", homeCtrl);
// {
  // console.log("index route works");
  // console.log(req.body);
  // // console.log(User);
  // console.log(User.findOne({first_name: "Koty"}));
  // User.findOne({first_name: "Koty"}).then(function(user) {
  //   console.log("it runs")
  //   console.log(user);
  // });

  // User.findById("5748ad828b3f540c30a82b34").then(function(user) {
  //   console.log("it runs")
  //   console.log(user);
  // });
  // User.search();
    // yelp.search({ term: 'food', location: 'Manhattan' }).then(function (data) {
    //   // console.log(data);
    //   // res.json(data);
    //   res.render("index.ejs", {data});
    // }).catch(function (err) {
    //   console.error(err);
    // });
// });
