// seedAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    name: "Farhan Khan",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  await admin.save();
  console.log("Admin created ✅");
  mongoose.disconnect();
};

seed();
