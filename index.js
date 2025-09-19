require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.js");
const adminRoutes = require("./routes/admin.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
const resultRoutes = require("./routes/resultRoutes.js");
const attendanceRoutes = require("./routes/attendanceRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());

// Connect DB (runs once)
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use(notFound);
app.use(errorHandler);

// ✅ Detect if running on Vercel or locally
if (process.env.VERCEL) {
  // Export for Vercel (serverless)
  module.exports = app;
  module.exports.handler = serverless(app);
} else {
  // Run locally with app.listen
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}
// write this comment just for vercel refresh