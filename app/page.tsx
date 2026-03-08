"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  SignInButton,
  SignUpButton,
  SignedOut,
} from '@clerk/nextjs'

export default function Home() {

  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Chart refs
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // --------------------------
  // Redirect after login
  // --------------------------
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/overview');
    }
  }, [isLoaded, isSignedIn, router]);

  // --------------------------
  // Chart initialization
  // --------------------------
  useEffect(() => {
    const ctx = chartRef.current;

    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    
    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Food", "Transport", "Entertainment", "Bills"],
        datasets: [{
          label: "Spending",
          data: [300, 150, 100, 200],
          backgroundColor: ["#6366F1", "#22C55E", "#FACC15", "#EF4444"],
        }],
      },
    });

    // Cleanup function — LOGOUT FIX
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <header className="relative">
        <div className="w-full">
          <nav className="w-[80%] mx-auto px-6 py-4 flex justify-between items-center">
            <Image src="/images/logo.png" width={60} height={50} alt="logo" />
            <div className="space-x-5">
              <SignedOut>
                <SignInButton>
                  <span className="bg-sky-500 hover:bg-sky-300 p-3 text-white rounded-xl">Login</span>
                </SignInButton>
                <SignUpButton >
                  <span className="bg-sky-500 hover:bg-sky-300 p-3 text-white rounded-xl">Sign Up</span>
                </SignUpButton>
              </SignedOut>
            </div>
          </nav>
        </div>

        <div className="bg-white shadow relative overflow-hidden bg-cover bg-center w-[80%] h-80 mx-auto rounded-lg"
          style={{ backgroundImage: "url('/images/land1.jpg')" }}>
          <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-lg animate-fadeInLeft">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Track Your Money, Control Your Budget
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                A simple personal finance tracker that helps you manage expenses,
                set budgets, and achieve your financial goals.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3">Expense Tracking</h3>
              <p className="text-gray-600">
                Easily log and categorize your daily expenses for better money management.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3">Budget Setting</h3>
              <p className="text-gray-600">
                Set monthly or yearly budgets and stay on track with smart alerts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-transform hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3">Charts & Reports</h3>
              <p className="text-gray-600">
                Visualize your income and expenses with interactive charts and summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 text-center">
        <div className="max-w-5xl mx-auto px-6 animate-fadeIn">
          <h2 className="text-3xl font-bold mb-6">Why Choose Our Tracker?</h2>
          <ul className="text-gray-700 space-y-3">
            <li>✔ Save money with better expense awareness</li>
            <li>✔ Understand your spending habits</li>
            <li>✔ Set and achieve financial goals</li>
            <li>✔ Stress-free money management</li>
          </ul>
        </div>

        <Image
          src="/images/land2.jpg"
          width={1200}
          height={600}
          alt="land2"
          className="w-[80%] h-96 mx-auto mt-10 rounded-lg shadow-lg object-top"
        />
      </section>

      {/* Chart Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-6">See Your Spending in Action</h2>
        <canvas ref={chartRef} id="demoChart" className="mx-auto w-60 h-60"></canvas>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

          <div>
            <h2 className="text-2xl font-bold text-white mb-3">FinanceTracker</h2>
            <p className="text-sm text-gray-400">
              Smart tools to manage your expenses and grow better financial habits.
            </p>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} FinanceTracker — All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
