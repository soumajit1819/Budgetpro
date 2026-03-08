"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

export default function Top3ExpenseDaysChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await axios.get("/api/monthexpense");
      const expenses = res.data || [];

      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();

      //  day wise total
      const dayMap: Record<string, number> = {};

      expenses.forEach((e: any) => {
        const d = new Date(e.date);

        if (d.getMonth() === month && d.getFullYear() === year) {
          const day = d.getDate();
          dayMap[day] =
            (dayMap[day] || 0) + Number(e.amount || 0);
        }
      });

      //  top 3 highest expense days
      const top3 = Object.entries(dayMap)
        .map(([day, amount]) => ({
          day: `Day ${day}`,
          amount,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

      setChartData({
        labels: top3.map((d) => d.day),
        datasets: [
          {
            label: "Highest Expense Days",
            data: top3.map((d) => d.amount),
            borderColor: "#3b82f6", //  blue
            backgroundColor: "rgba(59,130,246,0.25)", // transparent blue
            fill: true,
            tension: 0.4,
            pointRadius: 5,
          },
        ],
      });
    };

    fetchExpenses();
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-3">
        Top 3 Highest Expense Days (This Month)
      </h2>

      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
}
