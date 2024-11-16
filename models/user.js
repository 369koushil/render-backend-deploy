const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [3, "min 3 chars required, got {VALUE}"],
    maxLength: [30, "max 30 chars allowed, got{VALUE}"],
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  fName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

 const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
