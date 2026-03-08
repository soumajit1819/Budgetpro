import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import Expense from "@/models/Expense";
import MonthlyIncome from "@/models/MonthlyIncome";

export async function GET() {
  try {
    await dbConnect();

    const incomes = await MonthlyIncome.find({});
    const expenses = await Expense.find({});

    const map = new Map();

    /* ---------- Monthly Income ---------- */
    incomes.forEach((mi) => {
      if (!mi.createdAt) return;

      const d = new Date(mi.createdAt);
      if (isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const monthLabel = d.toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      });

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          date: new Date(d.getFullYear(), d.getMonth(), 1),
          month: monthLabel,
          income: 0,
          expense: 0,
        });
      }

      const item = map.get(key);
      item.income += Number(mi.amount || 0);
    });

    /* ---------- Expense ---------- */
    expenses.forEach((e) => {
      if (!e.createdAt) return;

      const d = new Date(e.createdAt);
      if (isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const monthLabel = d.toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      });

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          date: new Date(d.getFullYear(), d.getMonth(), 1),
          month: monthLabel,
          income: 0,
          expense: 0,
        });
      }

      const item = map.get(key);
      item.expense += Number(e.amount || 0);
    });

    /* ---------- Final Result ---------- */
    const result = Array.from(map.values())
      .filter((i) => i.income > 0)
      .map((i) => ({
        id: i.id,
        date: i.date.toISOString(),
        month: i.month,
        income: i.income,
        savings: i.income - i.expense,
      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Savings table error" },
      { status: 500 }
    );
  }
}