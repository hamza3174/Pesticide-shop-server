const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                qty: {
                    type: Number,
                    default: 1,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                discountedPrice: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    { timestamps: true } // Optional: helps track when the cart was updated
);

module.exports = mongoose.model("Cart", cartSchema);