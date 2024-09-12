require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const userCtrl = {
  register: asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      throw new Error("Please provide all required fields");
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const userCreated = await User.create({
      password: hashedPassword,
      email,
      username // Add this line
    });

    console.log("userCreated", userCreated);
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id, // Changed to _id to match Mongoose default
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.json({
      message: "Login success",
      token,
      id: user._id,
      email: user.email,
      username: user.username, // Add this line
    });
  }),

  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select("-password");
    res.json({ user });
  }),
};

module.exports = userCtrl;
