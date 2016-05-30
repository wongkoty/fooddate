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
  console.log(req.body);
    client.sendMessage({
    to: "+" + req.body.phone_number,
    from: "+13478629876",
    body: "hey THere"
  }), function(err, data){
    if(err)
      console.log(err);
    console.log(data);
  }
});


module.exports = router;