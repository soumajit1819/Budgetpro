import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      default: "📌", // Optional default emoji
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
      default: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}`; 
      },
    },

    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  { timestamps: true },
);

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
