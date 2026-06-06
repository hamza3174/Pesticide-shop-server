const Product = require("../models/product");

// ================= CREATE PRODUCT =================
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            ...req.body,
            ownerId: req.userId
        });

        res.json(product);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

// ================= GET PRODUCTS =================
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            ownerId: req.userId
        });

        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findOneAndDelete({
            _id: req.params.id,
            ownerId: req.userId
        });

        res.json({ message: "Product deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};