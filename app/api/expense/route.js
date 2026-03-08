import dbConnect from "@/lib/dbConnection";
import {getUser} from "@/lib/getuser";
import Expense from "@/models/Expense";


export async function POST(req) {
    // Connect to the database
    await dbConnect();
    // Get the user ID 
    const userId = await getUser();

    // Parse the request body
    const body = await req.json();
    // Create a new expense entry
    const expense = await Expense.create({ ...body, userId });

    return Response.json(expense); // Return the created expense entry

}

export async function GET(req) {
    // Connect to the database
    await dbConnect();
    // Get the user ID 
    const userId = await  getUser();
    const expenses = await Expense.find({ userId });

    return Response.json(expenses); // Return the fetched expense entries
}   