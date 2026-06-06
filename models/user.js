const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        shopName: {
            type: String,
            default: null,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: ["owner"],
            default: "owner",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);