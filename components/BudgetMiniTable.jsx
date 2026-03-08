"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function BudgetMiniTable() {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const budgetRes = await axios.get("/api/budget");
        const expenseRes = await axios.get("/api/expense");

        const budgets = Array.isArray(budgetRes.data) ? budgetRes.data : [];
        const expenses = Array.isArray(expenseRes.data) ? expenseRes.data : [];

        const monthMap = {};

        // 💰 Budget
        budgets.forEach((b) => {
          const d = new Date(b.date || b.createdAt);
          const m = d.toLocaleString("default", { month: "short" });

          monthMap[m] = monthMap[m] || { budget: 0, expense: 0 };
          monthMap[m].budget += Number(b.amount || 0);
        });

        // 💸 Expense
        expenses.forEach((e) => {
          const d = new Date(e.date || e.createdAt);
          const m = d.toLocaleString("default", { month: "short" });

          monthMap[m] = monthMap[m] || { budget: 0, expense: 0 };
          monthMap[m].expense += Number(e.amount || 0);
        });

        // 📊 Prepare table data (latest 5 months)
        const tableData = [];

        MONTHS.forEach((m) => {
          if (monthMap[m]) {
            tableData.push({
              month: m,
              budget: monthMap[m].budget,
              savings: monthMap[m].budget - monthMap[m].expense,
            });
          }
        });

        // latest 5 only
        setData(tableData.slice(-5));
      } catch (err) {
        console.error("Budget table error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Savings</TableHead>
            <TableHead className="w-[40px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {item.month}
              </TableCell>

              <TableCell>
                ₹{item.budget}
              </TableCell>

              <TableCell
                className={`font-semibold ${
                  item.savings >= 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                ₹{item.savings}
              </TableCell>

              {/* 3 DOT MENU */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push("/savings")}
                    >
                      View Savings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-gray-500"
              >
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
