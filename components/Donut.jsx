"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Donut({ goalId }) {

  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState(0);
  const [saved, setSaved] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!goalId) return;

    const fetchGoal = async () => {
      try {

        setLoading(true);

        const res = await axios.get(`/api/goals/${goalId}`);
        const goal = res.data;

        setGoalName(goal.title);
        setTarget(goal.targetAmount);
        setSaved(goal.savedAmount || 0);

      } catch (err) {
        console.error("Donut fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();

  }, [goalId]);

  if (loading) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  if (!target) {
    return <p className="text-center text-gray-400">No goal data</p>;
  }

  // ===== CALCULATION =====

  const progress = Math.min(
    Math.round((saved / target) * 100),
    100
  );

  const radius = 78;
  const stroke = 14;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">

      {/* GOAL NAME */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        {goalName}
      </h3>

      <svg width="200" height="200">

        {/* Background */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="100"
          cy="100"
        />

        {/* Progress */}
        <circle
          stroke="url(#grad)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx="100"
          cy="100"
          transform="rotate(-90 100 100)"
        />

        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>

        {/* Percentage */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".35em"
          className="fill-gray-800 font-bold text-3xl"
        >
          {progress}%
        </text>

      </svg>

      {/* DETAILS */}

      <div className="mt-4 text-sm space-y-2 text-gray-700 text-center">

        <div>
          Target: ₹{target.toLocaleString()}
        </div>

        <div>
          Saved: ₹{saved.toLocaleString()}
        </div>

        <div>
          Remaining: ₹{(target - saved).toLocaleString()}
        </div>

      </div>

    </div>
  );
}