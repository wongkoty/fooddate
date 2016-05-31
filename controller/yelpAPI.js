// =========================
// Dependencies
// =========================
var express = require("express");
var request = require("request");
var router = express.Router();
var Yelp = require('yelp');
var User = require("../models/user.js");
var doesThisPrint = 123;


var yelp = new Yelp({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  token: process.env.token,
  token_secret: process.env.token_secret
});

// =========================
// Render search page
// =========================
router.get("/yelp", function(req, res) {
  console.log('test route APIcontroller works');
  res.render("./yelp/search.ejs", { message: req.flash("loginMessage")})
});

// =========================
// Render index page
// =========================
router.get("/yelp/index", function(req, res) {
  console.log("index route works");
  console.log(req.body);
  console.log(req.user);
  console.log("=========");
  console.log(req.session);
  console.log("=========");
  console.log(req.session.data);
  var data = req.session;
  // var sess = req.session;
  // console.log(sess);
  // var data = req.cookies.body;
  // console.log(data);
  // console.log(data.term);
  res.render("./yelp/index.ejs", data);
});

// ==============================
// Generates Show page
// ==============================
router.get("/yelp/:id", function(req,res){
  console.log("show page works")

//   yelp.search({ id: req.params.id }).then(function (data) {
//     // console.log(data);
//     // res.json(data);
//     res.render("show.ejs", {data});
//   }).catch(function (err) {
//     console.error(err);
// });
  yelp.business(req.params.id).then(function(data){
    console.log(data);
    console.log(data.location.coordinate.latitude);
    console.log(typeof data.location.coordinate.latitude);
    res.render("./yelp/show.ejs", {data});
  })
  .catch(function (err) {
    console.error(err);
    if (err.statusCode == 400 ){
      console.log("error in input");
      req.flash("ErrorMessage", "Invalid business")
      res.render("./yelp/search.ejs", { message: req.flash("ErrorMessage")})
    }
  })
});


// ==============================
// Posts query parameters
// ==============================
router.post("/yelp/index", function(req, res) {
  console.log("yelp post route works");
  console.log(req.body);
  var toMeters = req.body.radius_filter*1609.34;
  console.log("this is tometers " + toMeters)
  // req.session.data = req.body; // trying to set session to the body to refer to in my index
  // var test = JSON.stringify(req.body);
  // res.cookie("term", req.body.term);
  yelp.search({ term: req.body.term, limit: 10, sort: req.body.sort, category_filter: "food", radius_filter: toMeters, location: req.body.location })
  .then(function (data) {
    console.log("yelp search rendered");
    // console.log(data);
    req.session.data = data; // trying to set session to the body to refer to in my index
    // res.render("./yelp/index.ejs", {data}); //SUCCESS FINALLY TO PUT IN GET ROUTE
    res.redirect("/user/yelp/index");
  })
  .catch(function (err) {
    console.error(err);
    if (err.statusCode == 400 ){
      console.log("error in input");
      req.flash("searchErrorMessage", "Requires Location")
      res.render("./yelp/search.ejs", { message: req.flash("searchErrorMessage")})
    }
  });
  // cookieParser.JSONCookie(str)

  // yelp.search({ term: req.body.term, limit: 5, location: req.body.location}).then(function (data) {
  //   console.log("running yelp search");
  //   // console.log(data.businesses[0].name);
  //   // var business = data.businesses[0].name;
  //   res.cookie("businesses", business);
  //   console.log(data);
    // console.log(typeof data);
    // var test = JSON.stringify(data);
    // console.log(test);
    // res.json(data);
    // res.cookie("body", test);
    // res.session.data.push(data);
    // res.redirect("/index");
    // res.render("./yelp/index.ejs", {data}); //sends down json of returned search by user parameters
     //sends down json of returned search by user parameters
  // });

// router.post("/index", categoryCtrl, homeCtrl);

// {
//   // console.log("post route works");
//   console.log(req.body);
//   yelp.search({ term: 'food', limit: 3, location: req.body.location}).then(function (data) {
//     console.log(data);
//     // res.json(data);
//     res.render("index.ejs", {data}); //sends down json of returned search by user parameters
//   }).catch(function (err) {
//     console.error(err);
// });
// };
});

router.get('*', function(req, res){
  // res.send('what???', 404);
  res.render("./user/freg.ejs")
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// FUNCTION SECTION
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~


module.exports = router;