import mongoose from "mongoose";

const monthlyIncomeSchema = new mongoose.Schema(
  {
    //  Clerk userId is STRING, not ObjectId
    userId: {
      type: String,
      required: true,
      index: true,
    },

    sourceName: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // YYYY-MM (2026-01)
    month: {
      type: String,
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// AUTO-SET MONTH
monthlyIncomeSchema.pre("validate", function (next) {
  if (!this.month) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    this.month = `${year}-${month}`;
  }
  next();
});

//  PREVENT DUPLICATE SOURCE PER USER PER MONTH
monthlyIncomeSchema.index(
  { userId: 1, sourceName: 1, month: 1 },
  { unique: true }
);

// SAFE EXPORT
const MonthlyIncome =
  mongoose.models.MonthlyIncome ||
  mongoose.model("MonthlyIncome", monthlyIncomeSchema);

export default MonthlyIncome;
