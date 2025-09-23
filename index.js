require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.js");
const adminRoutes = require("./routes/admin.js");
const teacherRoutes = require("./routes/teacherRoutes.js")
const studentRoutes = require("./routes/studentRoutes.js")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lms-frontend-gilt-five.vercel.app",
      "https://lms-backend-rho-steel.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Connect DB (runs once)
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

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
