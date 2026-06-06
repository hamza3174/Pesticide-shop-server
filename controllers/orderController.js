const CartModel = require("../models/cart");
const OrderModel = require("../models/order");

// ================= CHECKOUT =================
exports.checkout = async (req, res) => {
    try {
        const { items: incomingItems } = req.body;

        if (!incomingItems || incomingItems.length === 0) {
            return res.status(400).json({
                message: "Cart items are required for checkout"
            });
        }

        const databaseCart = await CartModel.findOne({ userId: req.userId });
        if (!databaseCart || databaseCart.items.length === 0) {
            return res.status(400).json({
                message: "No active cart found for this user"
            });
        }

        const orderItems = incomingItems.map(incomingItem => {
            const dbMatch = databaseCart.items.find(
                (dbItem) => dbItem.productId.toString() === incomingItem.productId
            );

            const fallbackOriginalPrice = dbMatch ? dbMatch.price : 0;
            const finalPrice = incomingItem.sellingPrice ?? incomingItem.discountedPrice ?? fallbackOriginalPrice;

            return {
                productId: incomingItem.productId,
                qty: incomingItem.qty,
                price: fallbackOriginalPrice,
                discountedPrice: finalPrice
            };
        });

        const totalAmount = orderItems.reduce((acc, item) => {
            return acc + (item.discountedPrice * item.qty);
        }, 0);

        const order = await OrderModel.create({
            userId: req.userId,
            items: orderItems,
            totalAmount
        });

        await CartModel.findOneAndDelete({
            userId: req.userId
        });


        res.json({
            message: "Checkout successful",
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

// ================= GET ORDERS =================
exports.getOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({
            userId: req.userId
        }).populate("items.productId").sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};