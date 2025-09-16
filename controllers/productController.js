const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc Get all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc Create product
// @route POST /api/products
// @access Private (later you can require auth)
const createProduct = asyncHandler(async (req, res) => {
  const { title, price, description } = req.body;
  const product = new Product({ title, price, description });
  const created = await product.save();
  res.status(201).json(created);
});

// @desc Get single product
// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Update product
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const { title, price, description } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.title = title || product.title;
    product.price = price || product.price;
    product.description = description || product.description;
    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Delete product
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
