const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    image: {type: String},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
