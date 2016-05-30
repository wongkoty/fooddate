// =========================
// Dependencies
// =========================
var express = require("express");
var request = require("request");
var router = express.Router();
var Yelp = require('yelp');
var User = require("../models/user.js");


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
  res.render("./yelp/search.ejs")
});

// =========================
// Render index page
// =========================
router.get("/yelp/index", function(req, res) {
  console.log("index route works");
  // var sess = req.session;
  // console.log(sess);
  // var data = req.cookies.body;
  // console.log(data);
  // console.log(data.term);
  // res.render("index.ejs", {data});
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
    res.render("./yelp/show.ejs", {data});
  })
  .catch(function (err) {
    console.error(err);
  })
});


// ==============================
// Posts query parameters
// ==============================
router.post("/yelp/index", function(req, res) {
  console.log("yelp post route works");
  console.log(req.body);
  // var test = JSON.stringify(req.body);
  // res.cookie("term", req.body.term);
  yelp.search({ term: req.body.term, limit: 10, location: req.body.location })
  .then(function (data) {
    console.log(data);
    res.render("./yelp/index.ejs", {data});
  })
  .catch(function (err) {
    console.error(err);
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


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// FUNCTION SECTION
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~


module.exports = router;