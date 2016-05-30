// =========================
// Dependencies
// =========================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require("method-override")
var session = require('express-session');
var configDB = require("./config/database.js")
var db = process.env.MONGODB_URI || "mongodb://localhost/food_date_app_dev";
var port = process.env.PORT || 3000;

// =========================
// Middleware
// =========================
app.use(logger("dev"));
mongoose.connect(db);
require("./config/passport")(passport); //configuration for passsport
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
                saveUninitialized: true,
                resave: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));


// =========================
// Controller
// =========================
var userController = require("./controller/user.js")
app.use("/user", userController);


// =========================
// Listener
// =========================
app.listen(port, function() {
  console.log("We are on port: " + port);
})