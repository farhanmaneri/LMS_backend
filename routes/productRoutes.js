const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route("/").get(getProducts).post(createProduct);
router.post("/", upload.single("image"), createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
