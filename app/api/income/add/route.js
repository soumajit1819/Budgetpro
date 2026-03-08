import dbConnect from "@/lib/dbConnection";
import MonthlyIncome from "@/models/MonthlyIncome";
import {getUser} from "@/lib/getuser";
import { NextResponse } from "next/server";

/* =======================
   POST : Add Income
======================= */
export async function POST(req) {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sourceName, amount } = await req.json();

    if (!sourceName || isNaN(Number(amount))) {
      return NextResponse.json(
        { error: "Valid sourceName and amount are required" },
        { status: 400 }
      );
    }

    const income = await MonthlyIncome.create({
      userId,
      sourceName,
      amount: Number(amount),
    });

    return NextResponse.json(income, { status: 201 });

  } catch (error) {
    console.error("POST /api/income ERROR:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}

/* =======================
   GET : List Income
======================= */
export async function GET() {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const incomes = await MonthlyIncome
      .find({ userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(incomes, { status: 200 });

  } catch (error) {
    console.error("GET /api/income ERROR:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE : Delete by Month
======================= */
export async function DELETE(req) {
  try {
    await dbConnect();

    const userId = await getUser();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // YYYY-MM

    if (!month) {
      return NextResponse.json(
        { error: "Month required" },
        { status: 400 }
      );
    }

    const [year, mon] = month.split("-").map(Number);

    const start = new Date(year, mon - 1, 1, 0, 0, 0);
    const end = new Date(year, mon, 0, 23, 59, 59, 999);

    await MonthlyIncome.deleteMany({
      userId,
      createdAt: { $gte: start, $lte: end },
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("DELETE /api/income ERROR:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
