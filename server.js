require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.json());

app.use(
    cors({
        origin: [
            "https://pesticide-shop-client.vercel.app",
            "http://localhost:5173",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.options("*", cors());

// ================= ENV =================
const PORT = process.env.PORT || 3001;

// ================= DATABASE =================
mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@pesticideshop.7sir2du.mongodb.net/pesticideShop`
)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

// ================= LINK ROUTERS =================
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/", cartRoutes);
app.use("/", orderRoutes);
app.use("/", expenseRoutes);
app.use("/", dashboardRoutes);

// ================= HOME =================
app.get("/", (req, res) => {
    res.send("🚀 Server Running");
});

// ================= START SERVER =================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});