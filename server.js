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
var session = require('express-session');
var db = process.env.MONGODB_URI || "mongodb://localhost/food_date_app_dev";
var port = process.env.PORT || 3000;

// =========================
// Middleware
// =========================

