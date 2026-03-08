"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function MonthlySavingsPie() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const budgetRes = await axios.get("/api/budget");
        const expenseRes = await axios.get("/api/expense");

        const budgets = Array.isArray(budgetRes.data) ? budgetRes.data : [];
        const expenses = Array.isArray(expenseRes.data) ? expenseRes.data : [];

        const monthMap = {};

        // ✅ Budget
        budgets.forEach((b) => {
          const d = new Date(b.date || b.createdAt);
          const m = d.toLocaleString("default", { month: "short" });

          monthMap[m] = monthMap[m] || { budget: 0, expense: 0 };
          monthMap[m].budget += Number(b.amount || 0);
        });

        // ✅ Expense
        expenses.forEach((e) => {
          const d = new Date(e.date || e.createdAt);
          const m = d.toLocaleString("default", { month: "short" });

          monthMap[m] = monthMap[m] || { budget: 0, expense: 0 };
          monthMap[m].expense += Number(e.amount || 0);
        });

        // ✅ Month order fix
        const labels = [];
        const data = [];

        MONTHS.forEach((m) => {
          if (monthMap[m]) {
            const saving = monthMap[m].budget - monthMap[m].expense;
            if (saving > 0) {
              labels.push(m);
              data.push(saving);
            }
          }
        });

        setChartData({
          labels,
          datasets: [
            {
              label: "Monthly Savings",
              data,
              backgroundColor: [
                "rgba(59,130,246,0.85)",
                "rgba(96,165,250,0.85)",
                "rgba(147,197,253,0.85)",
                "rgba(191,219,254,0.85)",
                "rgba(219,234,254,0.85)",
              ],
              hoverOffset: 25,
              borderWidth: 0,
            },
          ],
        });
      } catch (err) {
        console.error("Savings Pie Error", err);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* 3D shadow */}
      <div className="absolute inset-0 translate-y-4 blur-xl bg-blue-400 opacity-30 rounded-full" />

      <Pie
        data={chartData}
        options={{
          plugins: {
            legend: { position: "bottom" },
          },
        }}
      />
    </div>
  );
}
