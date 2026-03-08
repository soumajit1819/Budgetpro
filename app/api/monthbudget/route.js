import { NextResponse } from "next/server";
import Budget from "@/models/Budget";
import dbConnect from "@/lib/dbConnection";


export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23,59,59)
        const data = await Budget.find( {
            createdAt: {
                $gte: start,
                $lte: end,
            },
        }).sort({createdAt: 1});


         return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
        
    }
    
}