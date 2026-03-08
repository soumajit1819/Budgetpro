"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BarSave from "@/components/BarSave";
import SavedataTabil from "@/components/SavedataTabil";

export default function Page() {
  const [stats, setStats] = useState({
    totalBalance: 0,
    lastMonthDiff: 0,
    monthlySavings: 0,
    avgMonthly: 0,
    savingsProgress: 0,
    savingsPercent: 0,
  });

  const fetchStats = async () => {
    try {
      // 🔹 GET total monthly income
      const incomeRes = await axios.get("/api/income/dashboard");
      const totalMonthlyIncome = incomeRes.data.totalMonthlyIncome || 0;

      // 🔹 GET all expenses
      const expenseRes = await axios.get("/api/expense");
      const expenses = expenseRes.data || [];

      // 🔹 Month-wise aggregation
      const monthMap = {};

      expenses.forEach((e) => {
        if (!e.createdAt || !e.amount) return;
        const d = new Date(e.createdAt);
        if (isNaN(d.getTime())) return;
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!monthMap[monthKey]) monthMap[monthKey] = { expense: 0 };
        monthMap[monthKey].expense += Number(e.amount);
      });

      const now = new Date();
      const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const monthlyExpense = monthMap[currentMonthKey]?.expense || 0;

      const monthlySavings = totalMonthlyIncome - monthlyExpense;
      const totalBalance = monthlySavings; // যদি historical data না চাই

      // avgMonthly: এখন শুধু এক মাসের হিসাব
      const avgMonthly = monthlySavings;

      const savingsPercent = totalMonthlyIncome > 0
        ? Math.round((monthlySavings / totalMonthlyIncome) * 100)
        : 0;

      // savingsProgress placeholder 
      const savingsProgress = totalMonthlyIncome > 0
        ? Math.min(Math.round((monthlySavings / totalMonthlyIncome) * 100), 100)
        : 0;

      setStats({
        totalBalance,
        lastMonthDiff: 0,
        monthlySavings,
        avgMonthly,
        savingsPercent,
        savingsProgress,
      });

    } catch (err) {
      console.log("Error fetching stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="w-full p-6 mt-6 bg-[#F4EDED] rounded-2xl">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* TOTAL BALANCE */}
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Total Balance</p>
          <h2 className="text-2xl font-medium mt-2">₹{stats.totalBalance}</h2>
        </div>

        {/* THIS MONTH */}
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">This Month’s Savings</p>
          <h2 className="text-2xl font-medium mt-2">₹{stats.monthlySavings}</h2>
          <p className="text-green-600 text-sm mt-2">{stats.savingsPercent}% of income saved</p>
        </div>

        {/* AVERAGE */}
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Average Monthly Savings</p>
          <h2 className="text-2xl font-medium mt-2">₹{stats.avgMonthly}</h2>
        </div>

        {/* Saving */}
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Saving Progress</p>
          <h2 className="text-2xl font-medium mt-2">{stats.savingsProgress}%</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${stats.savingsProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <BarSave />
      </div>

      <div className="mt-8">
        <SavedataTabil />
      </div>
    </div>
  );
}