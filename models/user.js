// =========================
// Dependencies
// =========================
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");


var userSchema = mongoose.Schema({
  first_name: String,
  local : {
    email: {
      type: String,
      lowercase: true,
    },
    password: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

// =========================
// Model Methods
// =========================
userSchema.methods.generateHash = function(password, newUser, done) {
  // console.log("generate hash method reached");
  // console.log(password);
  // console.log(newUser);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      // console.log(newUser);
      // console.log(hash);
      newUser.local.password = hash;
      newUser.save(function(err) {
        if (err) {
          throw err;
        } else {
          console.log("user saved!");
          return done(null, newUser);
        }
      });
    });
  });
};

userSchema.methods.validPassword = function(password, hash) {
  console.log("validpassword method reached");
  console.log(hash);
  bcrypt.compare(password, hash, function(err, isMatch) {
    console.log(password);
    console.log(hash);
    console.log("comparing passwords");
    if (err) {
      console.log("there's an error");
    } else {
      console.log("right password");
    }

  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;