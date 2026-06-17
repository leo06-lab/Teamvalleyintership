const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.DB_URL;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const adminEmail = "admin@jobvalley.com";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists.");
      console.log("Email:", adminEmail);
      console.log("Password: Admin123!");
      process.exit(0);
    }

    const admin = await User.create({
      role: "admin",
      firstName: "JobValley",
      lastName: "Admin",
      email: adminEmail,
      phone: "+355 69 000 0000",
      password: "Admin123!",
    });

    console.log("Admin created successfully.");
    console.log("Email:", admin.email);
    console.log("Password: Admin123!");

    process.exit(0);
  } catch (error) {
    console.log("Seed admin error:", error.message);
    process.exit(1);
  }
};

seedAdmin();