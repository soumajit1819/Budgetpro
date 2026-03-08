import { getUser } from "@/lib/getuser";
import dbConnect from "@/lib/dbConnection";
import MonthlyIncome from "@/models/MonthlyIncome";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔥 THIS IS THE FIX
    const { id } = await context.params;

    const income = await MonthlyIncome.findOneAndUpdate(
      { _id: id, userId },     // same user protection
      { isActive: false },
      { new: true }
    );

    if (!income) {
      return NextResponse.json(
        { error: "Income not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Income deactivated", income },
      { status: 200 }
    );

  } catch (err) {
    console.error("DEACTIVATE ERROR:", err);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
