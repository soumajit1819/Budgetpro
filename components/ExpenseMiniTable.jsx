"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

/* CATEGORY + EMOJI MAP */
const categories = [
  { label: "Food", emoji: "🍔" },
  { label: "Travel", emoji: "✈️" },
  { label: "Shopping", emoji: "🛍️" },
  { label: "Rent", emoji: "🏠" },
  { label: "Electricity", emoji: "💡" },
];

export default function ExpenseMiniTable({ data = [] }) {
  const router = useRouter();

  // 🔹 ONLY FIRST 5
  const tableData = React.useMemo(() => data.slice(0, 5), [data]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const catName = row.original.category;
          const cat = categories.find((c) => c.label === catName);
          return (
            <div className="flex items-center gap-2">
              <span>{cat?.emoji || "📌"}</span>
              <span>{catName}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="font-semibold">₹{row.original.amount}</span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative rounded-xl border overflow-hidden">

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left font-medium"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 SINGLE 3-DOT (BOTTOM RIGHT) */}
      <div className="absolute bottom-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/expenses")}>
              View All Expenses
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
