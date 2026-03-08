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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔥 params MUST be awaited
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updateData = {};

    if (body.sourceName !== undefined) {
      updateData.sourceName = body.sourceName;
    }

    if (body.amount !== undefined) {
      const amount = Number(body.amount);
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json(
          { error: "Amount must be a valid number" },
          { status: 400 }
        );
      }
      updateData.amount = amount;
    }

    if (body.month !== undefined) {
      updateData.month = body.month;
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") {
        return NextResponse.json(
          { error: "isActive must be boolean" },
          { status: 400 }
        );
      }
      updateData.isActive = body.isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedIncome = await MonthlyIncome.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedIncome) {
      return NextResponse.json(
        { error: "Income not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedIncome, { status: 200 });

  } catch (err) {
    console.error("PUT UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
