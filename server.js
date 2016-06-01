// =========================
// Dependencies
// =========================
var express = require('express');
var app = express();
var favicon = require("serve-favicon");
var expressValidator = require("express-validator");
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require("method-override")
var session = require('express-session');
var configDB = require("./config/database.js")
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/food_date_app_dev";
var port = process.env.PORT || 3000;

// =========================
// Middleware
// =========================
app.use(logger("dev"));
mongoose.connect(MONGODB_URI);
require("./config/passport")(passport); //configuration for passsport
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(flash());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(session({secret: "secret",
                saveUninitialized: true, //save to store when it is new but not modified
                resave: false})); //saves even if not modified
app.use(passport.initialize()); //initializes passport
app.use(passport.session()); // uses passport sessions
app.use(express.static("public"));

// =========================
// Index
// =========================
app.get("/", function(req, res) {
  // console.log("main route works");
  console.log(req.cookies);
  console.log(req.session);
  console.log(req.user);
  if (req.user == null) {
    res.render("./user/index.ejs");
  } else {
    res.redirect("/user");
  }
})



// =========================
// Controllers
// =========================
//for user controller flow
var userController = require("./controller/user.js") 
app.use("/user", userController);


// =========================
// Listener
// =========================
app.listen(port, function() {
  console.log("We are on port: " + port);
})