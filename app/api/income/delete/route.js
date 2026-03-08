'use server';

import dbConnect from "@/lib/dbConnection";
import MonthlyIncome from "@/models/MonthlyIncome";
import { getUser } from "@/lib/getuser";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const deleted = await MonthlyIncome.deleteOne({
      _id: id,
      userId,
    });

    return NextResponse.json({ success: true, deleted });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
