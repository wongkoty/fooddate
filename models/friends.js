// =========================
// Dependencies
// =========================
var mongoose = require("mongoose");
var Users = require("./user.js");

var friendsSchema = mongoose.Schema({
  first_name: String //testing out friend schema
});

var Friends = mongoose.model("Friends", friendsSchema);

module.exports = Friends;