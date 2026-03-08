import { getUser } from "@/lib/getuser";
import dbConnect from "@/lib/dbConnection";
import MonthlyIncome from "@/models/MonthlyIncome";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const incomes = await MonthlyIncome
      .find({ userId })           // ✅ same userId
      .sort({ createdAt: -1 });

    return NextResponse.json(incomes, { status: 200 });

  } catch (err) {
    console.error("LIST ERROR:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
