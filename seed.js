const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust path if needed
require("dotenv").config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return mongoose.disconnect();
    }

    // Hash the password

    // Create admin
    const admin = new User({
      name: "Farhan Khan",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    mongoose.disconnect();
  }
};

seedAdmin();
