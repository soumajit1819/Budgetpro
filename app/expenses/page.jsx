"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ExpensesButton from "@/components/ExpensesButton";
import { DataTable } from "@/components/DataTable";


function Page() {
  const [expenses, setExpenses] = useState([]);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [loading, setLoading] = useState(true);

  const [allExpenses, setAllExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);




  // Sanitize Function
  const sanitize = (list) => {
    if (!Array.isArray(list)) return [];
    return list
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        ...item,
        category: item.category || "Unknown",
        amount: Number(item.amount) || 0,
        note: item.note || "",
        createdAt: item.createdAt || "",
      }));
  };


  const fetchCategories = async () => {
    const res = await axios.get("/api/excata");
    setCategories(res.data);
  };




  const fetchMonthExpenses = async () => {
    try {
      const res = await axios.get("/api/monthexpense"); // ONLY MONTH
      setExpenses(sanitize(res.data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingMonth(false);
    }
  };



  // Fetch All Expenses
  const fetchExpenses = async () => {
    try {

      const res1 = await axios.get("/api/expense"); // ALL
      setAllExpenses(sanitize(res1.data));
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleExpenseAdded = async () => {
    await fetchMonthExpenses(); // cards
    await fetchExpenses();      // table
  };


  useEffect(() => {
    fetchMonthExpenses();   // cards
    fetchExpenses();        // table
    fetchCategories();// budget categories
  }, [refreshFlag]);



  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // ---------- Calculations ----------
  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const categoryTotals = {};
  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) + Number(item.amount);
  });

  const highestCategory =
    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] ||
    ["—", 0];

  const mostRecent =
    [...expenses].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0] || null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-20 gap-y-16">

        {/* Total */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <h3 className="mt-3 text-3xl font-bold">₹{totalExpenses}</h3>
          <p className="mt-2 text-xs text-gray-400">This month</p>
        </div>

        {/* Highest Category */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl">
          <p className="text-sm text-gray-500">Highest Category</p>
          <div className="mt-4 flex items-center gap-10">
            <span className="inline-block w-3 h-3 rounded-full bg-red-400"></span>
            <div>
              <p className="font-semibold">{highestCategory[0]}</p>
              <p className="text-sm text-gray-600">₹{highestCategory[1]}</p>
            </div>
          </div>
        </div>

        {/* Most Recent */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl">
          <p className="text-sm text-gray-500">Most Recent</p>
          <div className="mt-4">
            <p className="font-semibold">{mostRecent?.category || "—"}</p>
            <p className="text-sm text-gray-600">
              {mostRecent?.createdAt
                ? new Date(mostRecent.createdAt).toDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="mt-10">
        <ExpensesButton
          onAdded={handleExpenseAdded}
          allowedCategories={categories}
        />

      </div>

      {/* Table */}
      {/* Table */}
<div
  className="mt-8 rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
  style={{
    backgroundImage: "url('/images/expance.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "rgba(255,255,255,0.7)", 
    backgroundBlendMode: "lighten",  
  }}
>
        <DataTable
          key={allExpenses.map(e => e.id).join('-')} // stable unique key
          data={allExpenses}
          setData={setAllExpenses}
          fetchExpenses={() => setRefreshFlag(prev => !prev)}
        />
        




      </div>

    </div>
  );
}

export default Page;
