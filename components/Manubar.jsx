"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function MenuBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Income", path: "/overview" },
    { name: "Budget", path: "/budget" },
    { name: "Expenses", path: "/expenses" },
    { name: "Savings", path: "/savings" },
    { name: "Goal", path: "/goals" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-3 bg-white shadow rounded-lg fixed top-4 left-4 z-50"
      >
        ☰
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 z-40 transform 
        ${open ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 md:hidden`}
      >
        <button
          onClick={() => setOpen(false)}
          className="text-xl absolute top-4 right-4"
        >
          ✕
        </button>

        <nav className="mt-10 flex flex-col gap-3">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg font-semibold transition 
                ${
                  isActive
                    ? "bg-gray-300/60 text-gray-900 shadow-inner"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <aside className="hidden md:block w-64 bg-white shadow-lg p-6 sticky top-20 h-[calc(100vh-5rem)] rounded-xl">
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-3 rounded-lg font-semibold transition 
                ${
                  isActive
                    ? "bg-gray-300/60 text-gray-900 shadow-inner"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default MenuBar;