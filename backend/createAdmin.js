const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/Userbymail");
require("dotenv").config();

const ADMIN_EMAIL = "admin@bookmytrip.com";
const ADMIN_PASSWORD = "Admin@123";

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI); //Atlas
    // await mongoose.connect(
    // "mongodb://127.0.0.1:27017/bookmytrip"
    // ); //Local

    console.log("MongoDB Connected");

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      salt
    );

    const admin = await User.create({
      username: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    console.log({
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin");
    console.error(err);
    process.exit(1);
  }
}

createAdmin();