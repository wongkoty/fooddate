// =========================
// Dependencies
// =========================
var express = require("express");
var request = require("request");
var router = express.Router();
var client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var User = require("../models/user.js");

router.get("/twilio", function(req, res) {
  console.log("twilio route reached");
  // res.render("./yelp/search.ejs")
});



router.post("/twilio", function(req, res) {
  console.log("test twilio works");
  // console.log(req.body);
  var test = req.body;
  console.log(test);
  console.log(typeof test);
  // console.log(test.addresss);
  console.log(req.user);
  var sendThis = "Yo " + test.friends + ", " + req.user.first_name + " wants to invite you to " + test.restaurant_name + " at " + test.address + ", " + test.city + " on " + test.date + " " + test.mobile_url;
  var sendThisNumber = "+1" + test.phone_number;
  console.log(sendThis);
  console.log(sendThisNumber);
  console.log(typeof sendThisNumber);
  if (sendThisNumber == "+19086981476") {
    console.log("wow its my number");
    client.sendMessage({
    to: sendThisNumber,
    from: process.env.TWILIO_NUMBER,
    body: "Let's show Freg what a pizza pie looks like!"
    }, function(err, data) {
    if(err) {
      console.log(err);
    }
    console.log(data);
  });
  } else {
      client.sendMessage({
      to: sendThisNumber,
      from: process.env.TWILIO_NUMBER,
      body: sendThis
    }, function(err, data) {
    if(err) {
      console.log(err);
    }
    console.log(data);
  });
  }
  // console.log(req.body.address.display_address);
  res.redirect("/user");
});


module.exports = router;