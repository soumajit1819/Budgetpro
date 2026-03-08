"use client";

export default function AddIncomeButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 rounded-lg flex items-center gap-2 text-white
        ${disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"}
      `}
    >
      <span className="text-xl">+</span>
      Add Income
    </button>
  );
}
