const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/service");
const bookingRoutes = require("./routes/booking");

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB Atlas connection
mongoose
  .connect(
    mongoose.connect(process.env.MONGO_URI)
  )
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});