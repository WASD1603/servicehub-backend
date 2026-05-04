const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"], // ✅ FIXED
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);