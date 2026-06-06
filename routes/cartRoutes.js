const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/auth");

router.post("/cart/add", authMiddleware, cartController.addToCart);
router.put("/cart/update-price", authMiddleware, cartController.updateDiscountPrice);
router.get("/cart", authMiddleware, cartController.getCart);
router.put("/cart/update", authMiddleware, cartController.updateCart);
router.delete("/cart", authMiddleware, cartController.clearCart);

module.exports = router;