"use client";
import * as React from "react";
import { Pie, PieChart, Cell, Label } from "recharts";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const computeColor = (index) => {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue} 72% 55%)`;
};

export default function Piechart({ refresh }) {
  const [budgetData, setBudgetData] = React.useState([]);
  const [dateRange, setDateRange] = React.useState("");

  React.useEffect(() => {
    async function loadBudget() {
      try {
        const res = await fetch("/api/monthbudget", { cache: "no-store" });
        const json = await res.json();

          const data = Array.isArray(json) ? json : json.data || [];

        // Map raw data
        const updated = (data || []).map((item) => ({
          browser: item.category,
          visitors: item.amount > 0 ? item.amount : 1,
          realValue: item.amount,
          createdAt: new Date(item.createdAt),
        }));

  
        //  GROUP + SUM BY CATEGORY (IMPORTANT FIX)
      
        const grouped = updated.reduce((acc, item) => {
          if (!acc[item.browser]) {
            acc[item.browser] = {
              browser: item.browser,
              visitors: item.realValue,
              realValue: item.realValue,
              createdAt: item.createdAt,
            };
          } else {
            acc[item.browser].visitors += item.realValue;
            acc[item.browser].realValue += item.realValue;
          }
          return acc;
        }, {});

        const finalGrouped = Object.values(grouped);
        setBudgetData(finalGrouped);


        //  Auto Date Range
    
        if (updated.length > 0) {
          const dates = updated.map((i) => new Date(i.createdAt));
          const minDate = new Date(Math.min(...dates));
          const maxDate = new Date(Math.max(...dates));

          const format = (d) =>
            d.toLocaleString("en-US", { month: "long", year: "numeric" });

          setDateRange(`${format(minDate)} - ${format(maxDate)}`);
        } else {
          setDateRange("No Date Available");
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadBudget();
  }, [refresh]);

  const finalData =
    budgetData.length > 0
      ? budgetData
      : [{ browser: "No Data", visitors: 1, realValue: 0 }];

  const total = React.useMemo(
    () => finalData.reduce((s, d) => s + (d.realValue || 0), 0),
    [finalData]
  );

  return (
    <Card className="flex flex-col w-[80%] mt-5 ml-14 bg-white border-none shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center items-center pb-4">
        <ChartContainer config={{}} className="mx-auto aspect-square h-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={finalData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={70}
              strokeWidth={5}
              minAngle={5}
            >
              {finalData.map((entry, idx) => (
                <Cell key={idx} fill={computeColor(idx)} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        ₹{total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 24}
                        className="fill-muted-foreground text-sm"
                      >
                        Total Budget
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
        </div>
        <div className="text-muted-foreground leading-none">
          Showing your category-wise budget
        </div>
      </CardFooter>
    </Card>
  );
}
