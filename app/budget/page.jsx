"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import AddBudgetButton from "@/components/AddBudgetButton";
import Piechart from "@/components/Piechart";
import OverallProgress from "@/components/OverallProgress";
import AllProgress from "@/components/AllProgress";
import SetbudgerBatton from "@/components/SetbudgerBatton";
import axios from "axios";

export default function Page() {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSources, setActiveSources] = useState(0);

  const handleRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchActiveSources = async () => {
      try {
        setLoading(true);


        const res = await axios.get("/api/income/dashboard");

        const sources = res.data?.activeSources || 0;
        setActiveSources(sources);

      } catch (err) {
        console.error("Failed to fetch active sources:", err);
        setActiveSources(0); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSources();
  }, [refresh]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show abc.jpg if activeSources is 0
  if (activeSources === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-100 py-20">
        <div className="w-[600px]  h-[500px] p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-2xl shadow-2xl flex flex-col items-center animate-fadeIn">
          <Image
            src="/images/add.jpg"
            alt="No active sources"
            width={1000}   // scaled down for card
            height={900}
            className="object-contain rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
          />
          <p className="mt-6 text-gray-700 text-center text-lg font-extrabold animate-pulse">
             No active sources found! Add your income first.
          </p>
        </div>
      </div>


    );
  }

  // Active sources > 0 → show budget page
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ADD BUDGET BUTTONS */}
      <div className="flex justify-between items-center pt-6 px-10 w-[90%] pl-40">
        <SetbudgerBatton onAdded={handleRefresh} />
        <AddBudgetButton onAdded={handleRefresh} />
        
      </div>

      {/* CENTERED CONTENT */}
      <div className="p-6 flex flex-col items-center gap-8">

        {/* Pie chart */}
        <div className="w-full flex justify-center">
          <Piechart refresh={refresh} />
        </div>

        {/* Overall Progress */}
        <div className="w-full flex justify-center pl-10">
          <OverallProgress refresh={refresh} />
        </div>

        {/* All Progress card */}
        <div className="w-full flex justify-center pl-10">
          <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl p-6 w-[80%]">
            <AllProgress refresh={refresh} />
          </div>
        </div>

      </div>
    </div>
  );
}
