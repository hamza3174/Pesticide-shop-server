const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        title: String,

        amount: Number,

        category: String,
    },

    {timestamps: true}
);

const expenseModel = mongoose.model( "Expense", expenseSchema );

module.exports = expenseModel;