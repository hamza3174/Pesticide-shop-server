const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        productName: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            default: "",
        },

        company: {
            type: String,
            default: "",
        },

        packagingSize: {
            type: String,
            default: "",
        },

        purchasePrice: {
            type: Number,
            default: 0,
        },

        sellingPrice: {
            type: Number,
            default: 0,
        },

        stockQuantity: {
            type: Number,
            default: 0,
        },

        reorderLevel: {
            type: Number,
            default: 0,
        },

        expiryDate: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);