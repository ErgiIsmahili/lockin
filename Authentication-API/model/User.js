const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Add this line
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
