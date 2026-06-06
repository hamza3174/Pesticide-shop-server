const OrderModel = require("../models/order");
const Product = require("../models/product");
const ExpenseModel = require("../models/expense");

// ================= DASHBOARD STATS =================
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yearStart = new Date(new Date().getFullYear(), 0, 1);

        const todayOrders = await OrderModel.find({
            userId: req.userId,
            createdAt: { $gte: today }
        }).populate("items.productId");

        const yearOrders = await OrderModel.find({
            userId: req.userId,
            createdAt: { $gte: yearStart }
        });

        const totalProducts = await Product.countDocuments({
            ownerId: req.userId
        });

        const expenses = await ExpenseModel.find({
            userId: req.userId
        });

        const todaySales = todayOrders.length;
        const todayProfit = todayOrders.reduce((acc, item) => acc + item.totalAmount, 0);
        const yearProfit = yearOrders.reduce((acc, item) => acc + item.totalAmount, 0);
        const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);
        const netProfit = yearProfit - totalExpenses;

        const recentSales = todayOrders.flatMap((order) =>
            order.items.map((item) => ({
                productName: item.productId?.productName,
                qty: item.qty,
                amount: (item.discountedPrice || item.price) * item.qty
            }))
        );

        res.json({
            todaySales,
            todayProfit,
            yearProfit,
            totalProducts,
            totalExpenses,
            netProfit,
            recentSales
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};