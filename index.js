require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const connectDB = require("./config/db.js");
const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin.js');
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
const resultRoutes = require("./routes/resultRoutes.js")
const attendanceRoutes= require("./routes/attendanceRoutes.js")
const cors= require("cors")


connectDB();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use(notFound);
app.use(errorHandler);
// POST create
// app.post("/api/products", (req, res) => {
//   const { title, price } = req.body;
//   const product = { id: Date.now().toString(), title, price };
//   products.push(product);
//   res.status(201).json(product);
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
