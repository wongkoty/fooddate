// =========================
// Dependencies
// =========================
var mongoose = require("mongoose");


var testSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  friends: Array,
  phone_number: Number,
  local : {
    email: {
      type: String,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  created: {
    type: Date, 
    default: Date.now
  }
});


var Test = mongoose.model('Test', testSchema);

module.exports = Test;


