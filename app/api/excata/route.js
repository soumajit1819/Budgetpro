import { NextResponse } from "next/server";
import Budget from "@/models/Budget";
import dbConnect from "@/lib/dbConnection";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const budgets = await Budget.find(
      {
        createdAt: { $gte: start, $lte: end },
      },
      { category: 1, emoji: 1, _id: 0 } // 👈 only needed fields
    );

    // ✅ unique category list
    const map = new Map();

    budgets.forEach((b) => {
      map.set(b.category, {
        label: b.category,
        emoji: b.emoji || "💰",
      });
    });

    return NextResponse.json([...map.values()]);
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
