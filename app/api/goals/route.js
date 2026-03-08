import dbConnect from "@/lib/dbConnection";
import Goal from "@/models/Goal";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getuser";


// CREATE GOAL
export async function POST(req) {
  try {

    await dbConnect();

    const userId = await getUser();
    const body = await req.json();

    const { title, targetAmount, startDate, durationMonths, notes } = body;

    if (!title || !targetAmount || !startDate || !durationMonths) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);

    const deadline = new Date(start);
    deadline.setMonth(deadline.getMonth() + Number(durationMonths));

    const goal = await Goal.create({
      userId,
      title,
      targetAmount: Number(targetAmount),
      startDate: start,
      deadline,
      durationMonths: Number(durationMonths),
      notes: notes || "",
    });

    return NextResponse.json(goal);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Goal creation failed" },
      { status: 500 }
    );

  }
}



// GET USER GOALS
export async function GET() {

  try {

    await dbConnect();

    const userId = await getUser();

    const goals = await Goal
      .find({ userId })
      .sort({ createdAt: -1 });

    return NextResponse.json(goals);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );

  }

}