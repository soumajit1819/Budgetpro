"use client";

import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

/* =====================
   CATEGORIES
===================== */
const CATEGORIES = [
  { label: "Food", emoji: "🍔" },
  { label: "Rent", emoji: "🏠" },
  { label: "Travel", emoji: "✈️" },
  { label: "Shopping", emoji: "🛍️" },
  { label: "Groceries", emoji: "🛒" },
  { label: "Electricity", emoji: "💡" },
  { label: "Water Bill", emoji: "🚰" },
  { label: "Internet", emoji: "📶" },
  { label: "Mobile Recharge", emoji: "📱" },
  { label: "Fuel", emoji: "⛽" },
  { label: "Medical", emoji: "💊" },
  { label: "Education", emoji: "📚" },
  { label: "Entertainment", emoji: "🎬" },
  { label: "Subscription", emoji: "🔁" },
  { label: "Insurance", emoji: "🛡️" },
  { label: "EMI", emoji: "💳" },
  { label: "Gift", emoji: "🎁" },
  { label: "Personal Care", emoji: "🧴" },
  { label: "Maintenance", emoji: "🛠️" },
  { label: "Savings", emoji: "💰" },
  { label: "House Cleaning", emoji: "🧹" },
  { label: "Laundry", emoji: "🧺" },
  { label: "Car Wash", emoji: "🚗" },
  { label: "Bike Service", emoji: "🏍️" },
  { label: "Public Transport", emoji: "🚌" },
  { label: "Taxi", emoji: "🚕" },
  { label: "Train Ticket", emoji: "🚆" },
  { label: "Bus Ticket", emoji: "🎫" },
  { label: "Flight Ticket", emoji: "🛫" },
  { label: "Hotel Booking", emoji: "🏨" },
  { label: "Hostel", emoji: "🛏️" },
  { label: "Vacation", emoji: "🏖️" },
  { label: "Tour Package", emoji: "🧳" },
  { label: "Temple Donation", emoji: "🛕" },
  { label: "Church Donation", emoji: "⛪" },
  { label: "Mosque Donation", emoji: "🕌" },
  { label: "Charity", emoji: "❤️" },
  { label: "NGO Donation", emoji: "🤝" },
  { label: "Gym Membership", emoji: "🏋️" },
  { label: "Yoga Class", emoji: "🧘" },
  { label: "Swimming", emoji: "🏊" },
  { label: "Sports Equipment", emoji: "⚽" },
  { label: "Cricket", emoji: "🏏" },
  { label: "Football", emoji: "⚽" },
  { label: "Badminton", emoji: "🏸" },
  { label: "Tennis", emoji: "🎾" },
  { label: "Books", emoji: "📖" },
  { label: "Stationery", emoji: "✏️" },
  { label: "Exam Fees", emoji: "📝" },
  { label: "Coaching Fees", emoji: "🏫" },
  { label: "Online Course", emoji: "💻" },
  { label: "Software Purchase", emoji: "🖥️" },
  { label: "App Subscription", emoji: "📲" },
  { label: "Cloud Storage", emoji: "☁️" },
  { label: "Domain Hosting", emoji: "🌐" },
  { label: "Server Cost", emoji: "🖧" },
  { label: "Freelancer Payment", emoji: "👨‍💻" },
  { label: "Office Rent", emoji: "🏢" },
  { label: "Office Supplies", emoji: "📎" },
  { label: "Printer Ink", emoji: "🖨️" },
  { label: "Courier", emoji: "📦" },
  { label: "Postage", emoji: "✉️" },
  { label: "Packaging", emoji: "📦" },
  { label: "Marketing", emoji: "📢" },
  { label: "Advertising", emoji: "📣" },
  { label: "Facebook Ads", emoji: "📘" },
  { label: "Google Ads", emoji: "🔍" },
  { label: "Influencer Payment", emoji: "🤳" },
  { label: "Photography", emoji: "📸" },
  { label: "Videography", emoji: "🎥" },
  { label: "Editing Software", emoji: "🎞️" },
  { label: "Music Instruments", emoji: "🎸" },
  { label: "Music Class", emoji: "🎶" },
  { label: "Dance Class", emoji: "💃" },
  { label: "Art Supplies", emoji: "🎨" },
  { label: "Painting", emoji: "🖌️" },
  { label: "Craft Materials", emoji: "✂️" },
  { label: "Kids Toys", emoji: "🧸" },
  { label: "Baby Care", emoji: "👶" },
  { label: "Diapers", emoji: "🍼" },
  { label: "Pet Food", emoji: "🐶" },
  { label: "Pet Grooming", emoji: "🐕" },
  { label: "Vet Fees", emoji: "🐾" },
  { label: "Gardening", emoji: "🌱" },
  { label: "Plants", emoji: "🪴" },
  { label: "Seeds", emoji: "🌾" },
  { label: "Fertilizer", emoji: "🧪" },
  { label: "Home Decor", emoji: "🖼️" },
  { label: "Furniture", emoji: "🛋️" },
  { label: "Mattress", emoji: "🛏️" },
  { label: "Curtains", emoji: "🪟" },
  { label: "Lighting", emoji: "💡" },
  { label: "Kitchenware", emoji: "🍳" },
  { label: "Cookware", emoji: "🥘" },
  { label: "Gas Cylinder", emoji: "🔥" },
  { label: "Water Can", emoji: "💧" },
  { label: "RO Service", emoji: "🚰" },
  { label: "Pest Control", emoji: "🐜" },
  { label: "House Repair", emoji: "🔧" },
  { label: "Plumber", emoji: "🚿" },
  { label: "Electrician", emoji: "⚡" },
  { label: "Car Repair", emoji: "🔩" },
  { label: "Insurance Premium", emoji: "📄" },
  { label: "Health Checkup", emoji: "🩺" },
  { label: "Doctor Visit", emoji: "👨‍⚕️" },
  { label: "Medicines", emoji: "💊" },
  { label: "Hospital Bills", emoji: "🏥" },
  { label: "Emergency Fund", emoji: "🚨" },
  { label: "Tax Payment", emoji: "🧾" },
  { label: "CA Fees", emoji: "📊" },
  { label: "Legal Fees", emoji: "⚖️" },
  { label: "Court Fees", emoji: "🏛️" },
  { label: "Passport Fees", emoji: "🛂" },
  { label: "Visa Fees", emoji: "🌍" },
  { label: "License Renewal", emoji: "🪪" },
  { label: "ID Card", emoji: "🆔" },
  { label: "Miscellaneous", emoji: "📌" }
];

/* =====================
   TYPES
===================== */
type BudgetItem = {
  category: string;
  emoji: string;
  amount: string;
};

/* =====================
   COMPONENT
===================== */
export default function SetBudgetDialog({
  onAdded,
}: {
  onAdded?: () => void;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [items, setItems] = React.useState<BudgetItem[]>([
    { category: "", emoji: "📌", amount: "" },
  ]);

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  /* =====================
    Hook Functions
  ===================== */
  const addRow = () => {
    setItems((prev) => [
      ...prev,
      { category: "", emoji: "📌", amount: "" },
    ]);
  };

  const updateCategory = (index: number, label: string) => {
    const found = CATEGORIES.find((c) => c.label === label);
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        category: label,
        emoji: found?.emoji || "📌",
      };
      return copy;
    });
    setOpenIndex(null);
  };

  const updateAmount = (index: number, value: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], amount: value };
      return copy;
    });
  };

  /* =====================
     SAVE
  ===================== */
  const handleSave = async () => {
    for (const item of items) {
      if (!item.category || !item.amount || Number(item.amount) <= 0) {
        return toast.error("All category & amount required");
      }
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM


  try {
    // Delete current month budget first
    await axios.delete("/api/budget", {
      params: { month: currentMonth },
      withCredentials: true,
    });

    // Add new budgets
    for (const item of items) {
      try {
        const res = await axios.post("/api/budget", {
          category: item.category,
          emoji: item.emoji,
          amount: Number(item.amount),
          month: currentMonth,
        });

        toast.success(`${item.category} added successfully`);
      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Server error";
        toast.error(`${item.category}: ${msg}`);
        // Do NOT throw here — continue with next item
      }
    }

    setItems([{ category: "", emoji: "📌", amount: "" }]);
    setDialogOpen(false);
    onAdded?.();
  } catch (err) {
    console.error("Failed to save budget:", err);
    toast.error("Server error while saving budgets");
  }
};

  /* =====================
     UI
  ===================== */
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white rounded-xl">
          Set New Budget
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Set Monthly Budget</DialogTitle>
        </DialogHeader>

        {items.map((item, index) => (
          <div
            key={index}
            className="border rounded-2xl p-4 mb-4 space-y-3"
          >
            {/* CATEGORY SEARCHABLE COMBOBOX */}
            <div className="space-y-2">
              <Label>Category</Label>

              <Popover
                open={openIndex === index}
                onOpenChange={(open) =>
                  setOpenIndex(open ? index : null)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openIndex === index}
                    className={cn(
                      "w-full justify-between",
                      !item.category && "text-muted-foreground"
                    )}
                  >
                    {item.category
                      ? `${item.emoji} ${item.category}`
                      : "Select category"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    {/* 🔍 THIS WAS MISSING */}
                    <CommandInput
                      placeholder="Search category..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No category found.
                      </CommandEmpty>
                      <CommandGroup>
                        {CATEGORIES.map((c) => (
                          <CommandItem
                            key={c.label}
                            value={c.label}
                            onSelect={(value) =>
                              updateCategory(index, value)
                            }
                          >
                            {c.emoji} {c.label}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                item.category === c.label
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* AMOUNT */}
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={item.amount}
                onChange={(e) =>
                  updateAmount(index, e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full"
          onClick={addRow}
        >
          + Add another category
        </Button>

        <DialogFooter className="mt-4">
          <Button className="bg-pink-500" onClick={handleSave}>
            Save Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
