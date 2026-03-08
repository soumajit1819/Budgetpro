import dbConnect from "@/lib/dbConnection";
import Goal from "@/models/Goal";
import MonthlyIncome from "@/models/MonthlyIncome";
import Expense from "@/models/Expense";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getuser";

export async function GET(req, context) {

  try {

    await dbConnect();

    const userId = await getUser();

    
    const params = await context.params;
    const id = params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const goal = await Goal.findOne({
      _id: id,
      userId
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Goal not found" },
        { status: 404 }
      );
    }

    // income
    const incomes = await MonthlyIncome.find({ userId });

    // expense
    const expenses = await Expense.find({ userId });

    const incomeSum = incomes.reduce(
      (sum, i) => sum + Number(i.amount || 0),
      0
    );

    const expenseSum = expenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    let savedAmount = incomeSum - expenseSum;

    if (savedAmount < 0) savedAmount = 0;

    const progress = Math.min(
      (savedAmount / goal.targetAmount) * 100,
      100
    );

    return NextResponse.json({
      ...goal.toObject(),
      savedAmount,
      progress
    });

  } catch (error) {

    console.error("GOAL FETCH ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}
export async function PUT(req, context) {
  try {
    await dbConnect();
    const userId = await getUser();
    const { id } = context.params;

    const body = await req.json();

    const updated = await Goal.findOneAndUpdate(
      { _id: id, userId },
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Goal not found or update failed" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await dbConnect();
    const userId = await getUser();
    const { id } = context.params;

    const deleted = await Goal.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return NextResponse.json({ error: "Goal not found or delete failed" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}