import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import Expense from "@/models/Expense";
import MonthlyIncome from "@/models/MonthlyIncome";

export async function GET() {
  try {
    await dbConnect();

    const expenses = await Expense.find({});
    const monthlyIncomes = await MonthlyIncome.find({});

   

    const map = {};

    // ✅ Monthly Income month-wise (using createdAt)
    monthlyIncomes.forEach((mi) => {
      const d = new Date(mi.createdAt);
      if (isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!map[key]) map[key] = { budget: 0, expense: 0 };
      map[key].budget += Number(mi.amount || 0);
    });

    // ✅ Expense month-wise
    expenses.forEach((e) => {
      const d = new Date(e.createdAt);
      if (isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!map[key]) map[key] = { budget: 0, expense: 0 };
      map[key].expense += Number(e.amount || 0);
    });

  

    const chartData = Object.keys(map)
      .sort()
      .map((key) => {
        const { budget, expense } = map[key];
        const savings = budget - expense;

        if (savings <= 0) return null;

        const [year, month] = key.split("-");
        const date = new Date(year, month - 1);

        return {
          month: date.toLocaleString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          savings,
        };
      })
      .filter(Boolean);

    console.log("FINAL DATA 👉", chartData);

    return NextResponse.json(chartData);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Savings trend error" },
      { status: 500 }
    );
  }
}
