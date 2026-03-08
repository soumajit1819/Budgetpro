"use client"

import * as React from "react"
import axios from "axios"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ============================
   Type Definition (DB Schema)
============================ */
export type SavingsRow = {
  id: string
  date: string
  month: string
  income: number
  savings: number
}

/* ============================
   Table Columns
============================ */
const columns: ColumnDef<SavingsRow>[] = [
 
  {
    accessorKey: "month",
    header: "Month",
  },
  {
    accessorKey: "income",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Income <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        ₹{row.getValue("income")}
      </span>
    ),
  },
  {
    accessorKey: "savings",
    header: "Savings",
    cell: ({ row }) => (
      <span className="font-semibold text-green-600">
        ₹{row.getValue("savings")}
      </span>
    ),
  },
]

/* ============================
   Main Component
============================ */
export default function SavedataTable() {
  const [data, setData] = React.useState<SavingsRow[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])

  /* -------- Fetch DB Data -------- */
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/savings-table")
        if (Array.isArray(res.data)) {
          setData(res.data)
        }
      } catch (err) {
        console.error("Table data fetch error", err)
      }
    }
    fetchData()
  }, [])

  /* -------- Table Instance -------- */
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">

      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-semibold">
          Monthly Savings Overview
        </h2>

        {/* Filter by Month */}
        <Input
          placeholder="Filter month..."
          value={
            (table.getColumn("month")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("month")?.setFilterValue(e.target.value)
          }
          className="max-w-xs"
        />
      </div>

      {/* ---------- Table ---------- */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---------- Pagination ---------- */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
