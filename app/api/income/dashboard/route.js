import { getUser } from "@/lib/getuser";
import dbConnect from "@/lib/dbConnection";
import MonthlyIncome from "@/models/MonthlyIncome";
import { NextResponse } from "next/server";

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

    const uid = String(userId);

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0, 0, 0
    );

    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23, 59, 59, 999
    );

    // TOTAL ONLY ACTIVE INCOME
    const totalAgg = await MonthlyIncome.aggregate([
      {
        $match: {
          userId: uid,
          isActive: true,
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    // COUNT ONLY ACTIVE SOURCES
    const activeSources = await MonthlyIncome.countDocuments({
      userId: uid,
      isActive: true,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // LAST UPDATED ACTIVE RECORD
    const lastUpdated = await MonthlyIncome.findOne({
      userId: uid,
      isActive: true
    })
      .sort({ updatedAt: -1 })
      .select("updatedAt");

    return NextResponse.json({
      month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
      totalMonthlyIncome: totalAgg[0]?.total || 0,
      activeSources,
      lastUpdated: lastUpdated?.updatedAt || null
    });

  } catch (err) {
    console.error("GET /api/income/dashboard ERROR:", err);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
