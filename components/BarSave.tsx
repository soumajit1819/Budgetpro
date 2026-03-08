"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


interface SavingsData {
  month: string;
  savings: number;
}

const chartConfig = {
  savings: {
    label: "Savings",
    color: "#3b82f6",
  },
};

export default function BarSave() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [data, setData] = useState<SavingsData[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // fetch chart data for selected year
  const fetchData = async (selectedYear: number) => {
    try {
      const res = await axios.get("/api/savings-trend");
      const allData: SavingsData[] = res.data || [];

      // get only selected year
      const filteredData = allData.filter((item) => {
        const yearSuffix = String(selectedYear).slice(-2);
        return item.month.endsWith(yearSuffix); // "Jan 26" → check last 2 digits
      });

      setData(filteredData);
    } catch (err) {
      console.error("Error fetching savings trend:", err);
    }
  };

  // fetch available years dynamically
  const fetchAvailableYears = async () => {
    try {
      const res = await axios.get("/api/savings-trend");
      const allData: SavingsData[] = res.data || [];

      const yearsSet = new Set<number>();
      allData.forEach((item) => {
        const yearPart = item.month.split(" ")[1]; // "Jan 26" → "26"
        const fullYear = "20" + yearPart; 
        yearsSet.add(Number(fullYear));
      });

      const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
      setAvailableYears(sortedYears);
    } catch (err) {
      console.error("Error fetching available years:", err);
    }
  };

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    fetchData(year);
  }, [year]);

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardHeader className="pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-medium">Savings Trend</CardTitle>
          <CardDescription className="text-xs">Month wise savings</CardDescription>
        </div>

        {/* Year Selector */}
        <select
          className="border rounded-md px-2 py-1 text-sm mt-2 sm:mt-0 text-black"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {availableYears.length > 0 ? (
            availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))
          ) : (
            <option value={currentYear}>{currentYear}</option>
          )}
        </select>
      </CardHeader>

      <CardContent className="pt-1 px-2">
        <ChartContainer config={chartConfig} className="h-[160px] w-full">
          <BarChart data={data} barSize={26} barCategoryGap="10%">
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              fontSize={12}
            />
            <YAxis hide />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar
              dataKey="savings"
              radius={[8, 8, 8, 8]}
              fill="url(#savingsGradient)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="text-[11px] text-muted-foreground pt-1">
        Net savings per month
      </CardFooter>
    </Card>
  );
}