import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import { getUser } from "@/lib/getuser";
import MonthlyIncome from "@/models/MonthlyIncome";
import mongoose from "mongoose";

export async function PUT(req, context) {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 THIS IS THE FIX
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const updateData = {
      sourceName: body.sourceName,
      amount: Number(body.amount),
      month: body.month,
      isActive: body.isActive,
    };

    Object.keys(updateData).forEach(
      k => updateData[k] === undefined && delete updateData[k]
    );

    if (!Object.keys(updateData).length) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await MonthlyIncome.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Income not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT ERROR FULL:", error);
    return NextResponse.json(
      { error: error.message || "Update failed" },
      { status: 500 }
    );
  }
}
