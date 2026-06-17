const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["candidate", "company", "admin"],
      required: true,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    companyName: { type: String, trim: true },
    nipt: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },
    website: { type: String, trim: true },
    address: { type: String, trim: true },
    industry: { type: String, trim: true },
    companySize: { type: String, trim: true },
    description: { type: String, trim: true },
    logo: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password para ruajtjes
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Krahasim password gjatë login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
