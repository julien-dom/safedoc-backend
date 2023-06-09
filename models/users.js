const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  city: String,
  orientation: String,
  gender: String,
  token: String,
  doctor: String,
  isAdmin: Boolean
});

const User = mongoose.model('users', userSchema);

module.exports = User;