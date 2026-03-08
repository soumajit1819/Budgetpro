"use client";

import * as React from "react";
import { useEffect } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ArrowUpDown, MoreHorizontal, ChevronDown } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";



const categories: CategoryType[] = [
  { label: "Food", value: "food", emoji: "🍔" },
  { label: "Rent", value: "rent", emoji: "🏠" },
  { label: "Travel", value: "travel", emoji: "✈️" },
  { label: "Shopping", value: "shopping", emoji: "🛍️" },
  { label: "Groceries", value: "groceries", emoji: "🛒" },
  { label: "Electricity", value: "electricity", emoji: "💡" },
  { label: "Water Bill", value: "water-bill", emoji: "🚰" },
  { label: "Internet", value: "internet", emoji: "📶" },
  { label: "Mobile Recharge", value: "mobile-recharge", emoji: "📱" },
  { label: "Fuel", value: "fuel", emoji: "⛽" },
  { label: "Medical", value: "medical", emoji: "💊" },
  { label: "Education", value: "education", emoji: "📚" },
  { label: "Entertainment", value: "entertainment", emoji: "🎬" },
  { label: "Subscription", value: "subscription", emoji: "🔁" },
  { label: "Insurance", value: "insurance", emoji: "🛡️" },
  { label: "EMI", value: "emi", emoji: "💳" },
  { label: "Gift", value: "gift", emoji: "🎁" },
  { label: "Personal Care", value: "personal-care", emoji: "🧴" },
  { label: "Maintenance", value: "maintenance", emoji: "🛠️" },
  { label: "Savings", value: "savings", emoji: "💰" },
  { label: "House Cleaning", value: "house-cleaning", emoji: "🧹" },
  { label: "Laundry", value: "laundry", emoji: "🧺" },
  { label: "Car Wash", value: "car-wash", emoji: "🚗" },
  { label: "Bike Service", value: "bike-service", emoji: "🏍️" },
  { label: "Public Transport", value: "public-transport", emoji: "🚌" },
  { label: "Taxi", value: "taxi", emoji: "🚕" },
  { label: "Train Ticket", value: "train-ticket", emoji: "🚆" },
  { label: "Bus Ticket", value: "bus-ticket", emoji: "🎫" },
  { label: "Flight Ticket", value: "flight-ticket", emoji: "🛫" },
  { label: "Hotel Booking", value: "hotel-booking", emoji: "🏨" },
  { label: "Hostel", value: "hostel", emoji: "🛏️" },
  { label: "Vacation", value: "vacation", emoji: "🏖️" },
  { label: "Tour Package", value: "tour-package", emoji: "🧳" },
  { label: "Temple Donation", value: "temple-donation", emoji: "🛕" },
  { label: "Church Donation", value: "church-donation", emoji: "⛪" },
  { label: "Mosque Donation", value: "mosque-donation", emoji: "🕌" },
  { label: "Charity", value: "charity", emoji: "❤️" },
  { label: "NGO Donation", value: "ngo-donation", emoji: "🤝" },
  { label: "Gym Membership", value: "gym-membership", emoji: "🏋️" },
  { label: "Yoga Class", value: "yoga-class", emoji: "🧘" },
  { label: "Swimming", value: "swimming", emoji: "🏊" },
  { label: "Sports Equipment", value: "sports-equipment", emoji: "⚽" },
  { label: "Cricket", value: "cricket", emoji: "🏏" },
  { label: "Football", value: "football", emoji: "⚽" },
  { label: "Badminton", value: "badminton", emoji: "🏸" },
  { label: "Tennis", value: "tennis", emoji: "🎾" },
  { label: "Books", value: "books", emoji: "📖" },
  { label: "Stationery", value: "stationery", emoji: "✏️" },
  { label: "Exam Fees", value: "exam-fees", emoji: "📝" },
  { label: "Coaching Fees", value: "coaching-fees", emoji: "🏫" },
  { label: "Online Course", value: "online-course", emoji: "💻" },
  { label: "Software Purchase", value: "software-purchase", emoji: "🖥️" },
  { label: "App Subscription", value: "app-subscription", emoji: "📲" },
  { label: "Cloud Storage", value: "cloud-storage", emoji: "☁️" },
  { label: "Domain Hosting", value: "domain-hosting", emoji: "🌐" },
  { label: "Server Cost", value: "server-cost", emoji: "🖧" },
  { label: "Freelancer Payment", value: "freelancer-payment", emoji: "👨‍💻" },
  { label: "Office Rent", value: "office-rent", emoji: "🏢" },
  { label: "Office Supplies", value: "office-supplies", emoji: "📎" },
  { label: "Printer Ink", value: "printer-ink", emoji: "🖨️" },
  { label: "Courier", value: "courier", emoji: "📦" },
  { label: "Postage", value: "postage", emoji: "✉️" },
  { label: "Packaging", value: "packaging", emoji: "📦" },
  { label: "Marketing", value: "marketing", emoji: "📢" },
  { label: "Advertising", value: "advertising", emoji: "📣" },
  { label: "Facebook Ads", value: "facebook-ads", emoji: "📘" },
  { label: "Google Ads", value: "google-ads", emoji: "🔍" },
  { label: "Influencer Payment", value: "influencer-payment", emoji: "🤳" },
  { label: "Photography", value: "photography", emoji: "📸" },
  { label: "Videography", value: "videography", emoji: "🎥" },
  { label: "Editing Software", value: "editing-software", emoji: "🎞️" },
  { label: "Music Instruments", value: "music-instruments", emoji: "🎸" },
  { label: "Music Class", value: "music-class", emoji: "🎶" },
  { label: "Dance Class", value: "dance-class", emoji: "💃" },
  { label: "Art Supplies", value: "art-supplies", emoji: "🎨" },
  { label: "Painting", value: "painting", emoji: "🖌️" },
  { label: "Craft Materials", value: "craft-materials", emoji: "✂️" },
  { label: "Kids Toys", value: "kids-toys", emoji: "🧸" },
  { label: "Baby Care", value: "baby-care", emoji: "👶" },
  { label: "Diapers", value: "diapers", emoji: "🍼" },
  { label: "Pet Food", value: "pet-food", emoji: "🐶" },
  { label: "Pet Grooming", value: "pet-grooming", emoji: "🐕" },
  { label: "Vet Fees", value: "vet-fees", emoji: "🐾" },
  { label: "Gardening", value: "gardening", emoji: "🌱" },
  { label: "Plants", value: "plants", emoji: "🪴" },
  { label: "Seeds", value: "seeds", emoji: "🌾" },
  { label: "Fertilizer", value: "fertilizer", emoji: "🧪" },
  { label: "Home Decor", value: "home-decor", emoji: "🖼️" },
  { label: "Furniture", value: "furniture", emoji: "🛋️" },
  { label: "Mattress", value: "mattress", emoji: "🛏️" },
  { label: "Curtains", value: "curtains", emoji: "🪟" },
  { label: "Lighting", value: "lighting", emoji: "💡" },
  { label: "Kitchenware", value: "kitchenware", emoji: "🍳" },
  { label: "Cookware", value: "cookware", emoji: "🥘" },
  { label: "Gas Cylinder", value: "gas-cylinder", emoji: "🔥" },
  { label: "Water Can", value: "water-can", emoji: "💧" },
  { label: "RO Service", value: "ro-service", emoji: "🚰" },
  { label: "Pest Control", value: "pest-control", emoji: "🐜" },
  { label: "House Repair", value: "house-repair", emoji: "🔧" },
  { label: "Plumber", value: "plumber", emoji: "🚿" },
  { label: "Electrician", value: "electrician", emoji: "⚡" },
  { label: "Car Repair", value: "car-repair", emoji: "🔩" },
  { label: "Insurance Premium", value: "insurance-premium", emoji: "📄" },
  { label: "Health Checkup", value: "health-checkup", emoji: "🩺" },
  { label: "Doctor Visit", value: "doctor-visit", emoji: "👨‍⚕️" },
  { label: "Medicines", value: "medicines", emoji: "💊" },
  { label: "Hospital Bills", value: "hospital-bills", emoji: "🏥" },
  { label: "Emergency Fund", value: "emergency-fund", emoji: "🚨" },
  { label: "Tax Payment", value: "tax-payment", emoji: "🧾" },
  { label: "CA Fees", value: "ca-fees", emoji: "📊" },
  { label: "Legal Fees", value: "legal-fees", emoji: "⚖️" },
  { label: "Court Fees", value: "court-fees", emoji: "🏛️" },
  { label: "Passport Fees", value: "passport-fees", emoji: "🛂" },
  { label: "Visa Fees", value: "visa-fees", emoji: "🌍" },
  { label: "License Renewal", value: "license-renewal", emoji: "🪪" },
  { label: "ID Card", value: "id-card", emoji: "🆔" },
  { label: "Miscellaneous", value: "miscellaneous", emoji: "📌" }
];

// TYPE
export interface Payment {
  _id?: string;
  category: string;
  emoji?: string;
  amount: number;
  note: string;
  date: string;
}

// COLUMNS
export const getColumns = (handleEditClick: (data: Payment) => void, handleDelete: (id: string) => void) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border border-gray-400 rounded-[4px] w-5 h-5 flex items-center justify-center"
        ref={(el) => {
          if (el) {
            const isIndeterminate =
              table.getIsSomePageRowsSelected() &&
              !table.getIsAllPageRowsSelected()

            el.indeterminate = isIndeterminate
          }
        }}
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />



    ),
    cell: ({ row }) => (
      <Checkbox
        className="border border-gray-400 rounded-[4px] w-5 h-5 flex items-center justify-center"
        ref={(el) => {
          if (el) {
            const isIndeterminate =
              row.getIsSomeSelected() && !row.getIsSelected()

            el.indeterminate = isIndeterminate
          }
        }}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />




    ),
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      // category match
      const cat = categories.find(c => c.label === category || c.value === category);
      const emoji = cat ? cat.emoji : ""; // match করলে emoji দেখাবে
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span>{category}</span>
        </div>
      );
    },
  },



  {
    accessorKey: "amount",
    header: "Amount",
  },

  {
    accessorKey: "note",
    header: "Note",
  },

  // DATE
  {
    accessorKey: "date",
    sortingFn: "datetime",
    header: "Date",
    cell: ({ row }) => {
      const raw = row.getValue("date");
      if (!raw) return "-";
      const date = new Date(raw);
      return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
    },
  },


  // ACTIONS
  {
    id: "actions",
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const expense = row.original as Payment;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(expense.amount))}>
              Copy Amount
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => handleEditClick(expense)}>Edit</DropdownMenuItem>

            <DropdownMenuItem className="text-red-500" onClick={() => expense._id && handleDelete(expense._id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// MAIN COMPONENT
export function DataTable({ data, setData, fetchExpenses }) {
  const [editData, setEditData] = React.useState<Payment | null>(null);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false)

  // EDIT MODAL OPEN
  const handleEditClick = (item: Payment) => {
    const normalized = item.date ? new Date(item.date).toISOString().slice(0, 10) : "";
    setEditData({ ...item, date: normalized });
    setOpenEdit(true);
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await axios.delete(`/api/expense/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
      fetchExpenses?.();
      toast.success("Deleted!")




    } catch {
      toast.error("Delete Error!");
    }
  };

  // UPDATE
  const handleEdit = async () => {
    if (!editData?._id) return;

    try {
      const { _id, ...rest } = editData; // exclude _id from body
      await axios.put(`/api/expense/${_id}`, rest);

      setData(prev =>
        prev.map(item => item._id === editData._id ? editData : item)
      );


      fetchExpenses?.(); // call the function to refresh data
      toast.success("Updated!");
      setOpenEdit(false);

    } catch (err) {
      toast.error("Update Error");
    }
  };

  // TABLE CONFIG
  const columns = React.useMemo(() => getColumns(handleEditClick, handleDelete), []);

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "date", desc: true }
  ]);
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [visibility, setVisibility] = React.useState<VisibilityState>({});
  const [selection, setSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters: filters, columnVisibility: visibility, rowSelection: selection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setFilters,
    onColumnVisibilityChange: setVisibility,
    onRowSelectionChange: setSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
  });

  useEffect(() => {
    table.setPageIndex(0);   // always go to FIRST PAGE
  }, [data.length]);



  return (
    <div className="w-full">

      {/* Filters */}
      <div className="flex gap-4 items-center py-4">
        <Input
          placeholder="Filter category..."
          value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("category")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />

        <Input
          type="date"
          value={(table.getColumn("date")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("date")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter((c) => c.getCanHide()).map((c) => (
              <DropdownMenuItem key={c.id} onClick={() => c.toggleVisibility()}>
                {c.id}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2 py-4">
        <Button variant="outline" size="sm" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
          Next
        </Button>
      </div>

      {/* Edit Modal */}
      {openEdit && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[380px] space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold text-center">Edit Expense</h2>

            <Input
              placeholder="Category"
              value={editData.category || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev!, category: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={editData.amount?.toString() || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev!, amount: Number(e.target.value) || 0 }))}
            />
            <Input
              placeholder="Note"
              value={editData.note || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev!, note: e.target.value }))}
            />
            <Input
              type="date"
              value={editData.date || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev!, date: e.target.value }))}
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpenEdit(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Update</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
