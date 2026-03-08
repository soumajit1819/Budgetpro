import dbConnect from "@/lib/dbConnection";
import { getUser } from "@/lib/getuser";
import Expense from "@/models/Expense";

export async function PUT(req, context) {
  try {
    await dbConnect();
    const userId = await getUser();

    const { id } = await context.params; // ⭐ FINAL FIX HERE

    const body = await req.json();

    const updated = await Expense.findOneAndUpdate(
      { _id: id, userId },
      body,
      { new: true }
    );

    return Response.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return Response.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await dbConnect();
    const userId = await getUser();

    const { id } = await context.params; // ⭐ FINAL FIX HERE

    await Expense.findOneAndDelete({ _id: id, userId });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}
