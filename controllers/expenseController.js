const ExpenseModel = require("../models/expense");

// ================= ADD EXPENSE =================
exports.addExpense = async (req, res) => {
    try {
        const { title, amount, category } = req.body;

        const expense = await ExpenseModel.create({
            userId: req.userId,
            title,
            amount,
            category
        });

        res.json(expense);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET EXPENSES =================
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseModel.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= DELETE EXPENSE =================
exports.deleteExpense = async (req, res) => {
    try {
        await ExpenseModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        res.json({ message: "Expense deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};