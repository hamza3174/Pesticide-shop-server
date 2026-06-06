const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware, ownerOnly } = require("../middleware/auth");

router.post("/products", authMiddleware, productController.createProduct);
router.get("/products", authMiddleware, productController.getProducts);
router.delete("/products/:id", authMiddleware, productController.deleteProduct);

module.exports = router;