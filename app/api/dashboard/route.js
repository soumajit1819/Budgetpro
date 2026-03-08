'use server'

import dbConnect from "@/lib/dbConnection";
import {getUser} from "@/lib/getuser";
import Expense from "@/models/Expense";
import Budget from "@/models/Budget";

export async function GET(req) {
    // Connect to the database
    await dbConnect();
    // Get the user ID 
    const userId = await getUser();

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const budgets = await Budget.find({ 
        userId, 
        month, 
        year 
    });
    const expenses = await Expense.find({ 
        userId, 
        month, 
        year 
    });

    // Calculate total budget and total expenses
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const savings = totalBudget - totalExpenses;

    // Prepare the dashboard data
    const dashboardData = {
        totalBudget,
        totalExpenses,
        savings,
        budgets,
        expenses
    };

    return Response.json(dashboardData); // Return the dashboard data
}