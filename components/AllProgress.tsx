"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// ডাটার টাইপ ডিফাইন করা ভালো প্র্যাকটিস
interface ProgressData {
  category: string;
  budget: number;
  spent: number;
  percent: number;
}

export default function CategoryProgress({ refresh = false }) {
  const [data, setData] = useState<ProgressData[]>([]);

  const getCategoryProgress = async () => {
    try {
      const budgetRes = await axios.get("/api/monthbudget");
      const expenseRes = await axios.get("/api/monthexpense");

      const budgets = budgetRes.data;
      const expenses = expenseRes.data;

      // টাইপ ফিক্স করা হয়েছে এখানে
      const budgetByCategory = budgets.reduce((acc: Record<string, number>, item: any) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {});

      const spentByCategory = expenses.reduce((acc: Record<string, number>, item: any) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {});

      const result = Object.keys(budgetByCategory).map((category) => {
        const budget = budgetByCategory[category] || 0;
        const spent = spentByCategory[category] || 0;

        const percent =
          budget === 0 ? 0 : Math.round((spent / budget) * 100);

        return { category, budget, spent, percent };
      });

      setData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategoryProgress();
  }, [refresh]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {data.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-3xl shadow border">
          <h2 className="text-2xl font-semibold mb-4">{item.category}</h2>

          <div className="flex justify-between mb-1">
            <span className="font-bold">{item.percent}%</span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${item.percent}%`,
                background:
                  item.percent >= 80
                    ? "red"
                    : "linear-gradient(90deg,#7b2ff7,#f107a3)",
              }}
            />
          </div>

          <div className="flex justify-between text-sm mt-2 text-gray-600">
            <p>Budget: ₹{item.budget}</p>
            <p>Spent: ₹{item.spent}</p>
          </div>
        </div>
      ))}
    </div>
  );
}