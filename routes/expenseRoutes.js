const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const { authMiddleware, ownerOnly } = require("../middleware/auth");

router.post("/expenses", authMiddleware, expenseController.addExpense);
router.get("/expenses", authMiddleware, expenseController.getExpenses);
router.delete("/expenses/:id", authMiddleware, expenseController.deleteExpense);

module.exports = router;