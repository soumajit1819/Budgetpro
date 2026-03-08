import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userId: String,
    category: String,
    amount: Number,
    note: String,
    date: { type: Date, default: Date.now}
}, { timestamps: true });

// Export the model solving hot-reloading issues in development
export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);