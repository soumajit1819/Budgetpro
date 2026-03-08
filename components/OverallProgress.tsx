"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Progress } from "@/components/ui/progress";

export default function OverallProgress({ refresh }) {
  const [progress, setProgress] = useState(0);
  const [totalbudget, setTotalBudget] = useState(0);
  const [totalspent, setTotalSpent] = useState(0);

  const gettotaldata = async () => {
    try {
      const budget = await axios.get("/api/monthbudget");
      const expense = await axios.get("/api/monthexpense");

      const totalBudget = budget.data.reduce(
        (s, i) => s + (i.amount || 0),
        0
      );

      const totalSpent = expense.data.reduce(
        (s, i) => s + (i.amount || 0),
        0
      );

      const percent =
        totalBudget === 0
          ? 0
          : Math.round((totalSpent / totalBudget) * 100);

      setTotalBudget(totalBudget);
      setTotalSpent(totalSpent);
      setProgress(percent);
    } catch (error) {
      console.error("error :", error);
    }
  };

  useEffect(() => {
    gettotaldata();
  }, [refresh]);

  return (
    <div className="w-full max-w-[80%] bg-white rounded-3xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Overall Budget
      </h2>

      <div className="flex justify-between mb-4">
        <div>
          <p className="font-medium">Total Budget</p>
          <p className="text-xl font-bold">
            ₹ {totalbudget.toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="font-medium">Total Spent</p>
          <p className="text-xl font-bold">
            ₹ {totalspent.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mt-3">
        <Progress value={progress} className="h-4" />

        <div
          className="absolute top-0 left-0 h-4 rounded-full"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, #7b2ff7 0%, #f107a3 100%)",
          }}
        />
      </div>

      <p className="text-right font-bold mt-2">
        {progress}%
      </p>
    </div>
  );
}
