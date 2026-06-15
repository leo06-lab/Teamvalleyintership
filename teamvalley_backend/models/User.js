const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["candidate", "admin"],
      default: "candidate",
    },
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
