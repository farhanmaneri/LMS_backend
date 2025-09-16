require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const connectDB = require("./config/db.js");
const productRoutes = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");



connectDB();
const PORT = process.env.PORT || 5000;

// in-memory "database" array

// GET all
// basic middleware
app.use('/api/products', productRoutes);


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
