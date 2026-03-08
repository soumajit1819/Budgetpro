"use client";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import Donut from "@/components/Donut";

export default function Page() {

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [goalId, setGoalId] = useState(null);

  //  Fetch latest goal
  useEffect(() => {

    const fetchGoal = async () => {

      try {

        const res = await axios.get("/api/goals");
        const goals = res.data || [];

        if (goals.length > 0) {
          const latestGoal = goals.at(-1);
          setGoalId(latestGoal._id);
        }

      } catch (err) {

        console.error("Fetch goals error:", err.response?.data || err);

      }

    };

    fetchGoal();

  }, []);


  //  Monthly required calculation
  const monthlyRequired = useMemo(() => {

    if (!targetAmount || !durationMonths) return 0;

    return (Number(targetAmount) / Number(durationMonths)).toFixed(2);

  }, [targetAmount, durationMonths]);


  //  Deadline preview
  const deadlinePreview = useMemo(() => {

    if (!startDate || !durationMonths) return "";

    const d = new Date(startDate);
    d.setMonth(d.getMonth() + Number(durationMonths));

    return d.toLocaleDateString();

  }, [startDate, durationMonths]);


  //  Create goal
  const handleSubmit = async () => {

    if (!goalName || !targetAmount || !startDate || !durationMonths) {
      toast.error("Please fill all required fields");
      return;
    }

    if (Number(targetAmount) <= 0 || Number(durationMonths) <= 0) {
      toast.error("Invalid amount or duration");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post("/api/goals", {
        title: goalName,
        targetAmount: Number(targetAmount),
        startDate,
        durationMonths: Number(durationMonths),
        notes,
      });

      setGoalId(res.data._id);

      toast.success("Goal saved successfully");

      setGoalName("");
      setTargetAmount("");
      setStartDate("");
      setDurationMonths("");
      setNotes("");

    } catch (err) {

      console.error(err.response?.data || err);

      toast.error(
        err.response?.data?.error || "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen bg-[#f6f7fb] px-6 py-12">

      <div className="text-center mb-12">

        <h1 className="text-4xl font-bold text-gray-800">
          Set Your Savings Goal
        </h1>

        <p className="text-gray-500 mt-2">
          Plan and track your savings for your goals.
        </p>

      </div>


      <div className="max-w-6xl mx-auto bg-white rounded-[28px] shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">


        {/* LEFT FORM */}

        <div className="p-10 space-y-5">

          <input
            placeholder="Goal Name"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />

          <input
            type="number"
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />

          <input
            type="number"
            placeholder="Duration (Months)"
            value={durationMonths}
            onChange={(e) => setDurationMonths(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />


          {(targetAmount && durationMonths) && (

            <div className="bg-purple-50 p-4 rounded-xl text-sm text-gray-700">

              <p>
                Monthly Required: ₹ {monthlyRequired}
              </p>

              {deadlinePreview && (
                <p>
                  Estimated Deadline: {deadlinePreview}
                </p>
              )}

            </div>

          )}


          <textarea
            rows="4"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
          />


          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition"
          >

            {loading ? "Saving..." : "Set Goal"}

          </button>

        </div>


        {/* RIGHT SIDE */}

        <div className="bg-[#fafafe] p-10 border-l">

          <h2 className="text-xl font-semibold mb-6">
            Goal Progress
          </h2>

          <div className="w-56 h-56 mx-auto flex items-center justify-center">

            {goalId ? (

              <Donut key={goalId} goalId={goalId} />

            ) : (

              <div className="text-center">

                <p className="text-lg font-semibold text-gray-600">
                  Neither Loss nor Gain
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  Set your savings goal to start tracking progress
                </p>

              </div>

            )}

          </div>


          <div className="mt-8 flex justify-end">

            <Image
              src="/images/bca79beb-1073-4350-ba92-db421b6ac35b.png"
              alt="goal"
              width={260}
              height={240}
            />

          </div>

        </div>

      </div>

    </div>

  );

}