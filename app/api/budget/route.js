import dbConnect from "@/lib/dbConnection";
import Budget from "@/models/Budget";
import MonthlyIncome from "@/models/MonthlyIncome";
import { getUser } from "@/lib/getuser";
import { NextResponse } from "next/server";

/* =====================
   GET → Fetch budgets
===================== */
export async function GET(req) {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    const filter = month ? { userId, month } : { userId };

    const budgets = await Budget.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error("GET /api/budget error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* =====================
   POST → Add budget
===================== */
export async function POST(req) {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, emoji, amount, month } = await req.json();

    if (!category || !amount || !month) {
      return NextResponse.json(
        { message: "Category, amount and month are required" },
        { status: 400 },
      );
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    //  Only active income for this month
    let incomes = await MonthlyIncome.find({
      userId,
      month,
      isActive: true,
    });

    //  If no active income for this month
    if (!incomes.length) {
      return NextResponse.json(
        {
          message: `Set active income first for month ${month}.`,
        },
        { status: 400 },
      );
    }

    //  Calculate total income
    const totalIncome = incomes.reduce(
      (sum, inc) => sum + Number(inc.amount),
      0,
    );

    // Total existing budget for the month
    const budgets = await Budget.find({ userId, month });
    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);

    if (totalBudget + amountNum > totalIncome) {
      return NextResponse.json(
        {
          message: `Budget exceeded! Remaining ₹${totalIncome - totalBudget}`,
        },
        { status: 400 },
      );
    }
   

    //  Create budget
    const budget = await Budget.create({
      userId,
      category,
      emoji,
      amount: amountNum,
      month,
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error("POST /api/budget error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* =====================
   DELETE → Reset month
===================== */
export async function DELETE(req) {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { message: "Month is required" },
        { status: 400 },
      );
    }

    await Budget.deleteMany({ userId, month });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/budget error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
