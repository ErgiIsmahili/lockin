require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const userCtrl = {
  register: asyncHandler(async (req, res) => {
    const { email, password, username, image } = req.body;

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
      username,
      image
    });

    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
      image: userCreated.image,
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
      username: user.username,
      image: user.image,
    });
  }),

  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select("-password");
    res.json({ user });
  }),

  getUserGroups: asyncHandler(async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await User.findById(userId).populate('groups');

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ groups: user.groups });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user's groups", error: error.message });
    }
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const { username, image } = req.body;
    const userId = req.user.id;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, image },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
  }),
};

module.exports = userCtrl;