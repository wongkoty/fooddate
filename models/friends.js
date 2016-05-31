// =========================
// Dependencies
// =========================
var mongoose = require("mongoose");
var Users = require("./user.js");

var friendsSchema = mongoose.Schema({
  first_name: String
});

var Friends = mongoose.model("Friends", friendsSchema);

module.exports = Friends;