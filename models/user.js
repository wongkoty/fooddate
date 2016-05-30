// =========================
// Dependencies
// =========================
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");


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
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    // ============================
  // had to change hashmethod below because of async, couldn't get it to return before newUser saved
  // not sure why 
  // ============================
  // console.log("generate hash method reached");
  // console.log(password);
  // // console.log(newUser);
  // bcrypt.genSalt(10, function(err, salt) {
  //   bcrypt.hash(password, salt, function(err, hash) {
  //     // console.log(newUser);
  //     if (err) {
  //       // console.log("this is an error" + err);
  //     } else {
  //       console.log("This is the hash " + hash);
  //       return hash;
  //     }
  //   });
  // });
};

userSchema.methods.validPassword = function(password, hash) {
  return bcrypt.compareSync(password, this.local.password);


  // console.log("validpassword method reached");
  // console.log(hash);
  // bcrypt.compare(password, hash, function(err, isMatch) {
  //   console.log(password);
  //   console.log(hash);
  //   console.log("comparing passwords");
  //   if (err) {
  //     console.log("there's an error");
  //   } else {
  //     console.log("right password");
  //   }

  // });
};

var User = mongoose.model('User', userSchema);

module.exports = User;