const Product = require("../models/product");
const CartModel = require("../models/cart");

// ================= ADD TO CART =================
exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let cart = await CartModel.findOne({
            userId: req.userId
        });

        if (!cart) {
            cart = new CartModel({
                userId: req.userId,
                items: [
                    {
                        productId,
                        qty: 1,
                        price: product.sellingPrice,
                        discountedPrice: product.sellingPrice
                    }
                ]
            });
        } else {
            const item = cart.items.find(
                (i) => i.productId.toString() === productId
            );

            if (item) {
                item.qty += 1;
            } else {
                cart.items.push({
                    productId,
                    qty: 1,
                    price: product.sellingPrice,
                    discountedPrice: product.sellingPrice
                });
            }
        }

        await cart.save();

        const updatedCart = await CartModel.findOne({
            userId: req.userId
        }).populate("items.productId");

        res.json({
            items: updatedCart.items
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= UPDATE DISCOUNT PRICE =================
exports.updateDiscountPrice = async (req, res) => {
    try {
        const { productId, discountedPrice } = req.body;

        const cart = await CartModel.findOne({ userId: req.userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            (i) => i.productId.toString() === productId
        );
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (discountedPrice === undefined || discountedPrice === null || discountedPrice <= 0) {
            item.discountedPrice = item.price;
        } else {
            item.discountedPrice = discountedPrice;
        }

        await cart.save();

        const updatedCart = await CartModel.findOne({
            userId: req.userId
        }).populate("items.productId");

        res.json({ items: updatedCart.items });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= GET CART =================
exports.getCart = async (req, res) => {
    try {
        const cart = await CartModel.findOne({
            userId: req.userId
        }).populate("items.productId");

        if (!cart) {
            return res.json({ items: [] });
        }

        res.json({ items: cart.items });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= UPDATE CART =================
exports.updateCart = async (req, res) => {
    try {
        const { productId, action } = req.body;

        const cart = await CartModel.findOne({
            userId: req.userId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            (i) => i.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        if (action === "increase") {
            cart.items[itemIndex].qty += 1;
        }

        if (action === "decrease") {
            cart.items[itemIndex].qty -= 1;

            if (cart.items[itemIndex].qty <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        }

        await cart.save();

        const updatedCart = await CartModel.findOne({
            userId: req.userId
        }).populate("items.productId");

        res.json({ items: updatedCart.items });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ================= CLEAR CART =================
exports.clearCart = async (req, res) => {
    try {
        await CartModel.findOneAndDelete({
            userId: req.userId
        });

        res.json({ message: "Cart cleared" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};