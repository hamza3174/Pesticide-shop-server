const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/auth");

router.post("/checkout", authMiddleware, orderController.checkout);
router.get("/orders", authMiddleware, orderController.getOrders);

module.exports = router;