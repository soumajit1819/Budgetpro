"use client";

import { Button } from "@/components/ui/button";
import CataGory from "@/components/CataGoryExp";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

type Category = {
  label: string;
  emoji: string;
};

type Props = {
  onAdded?: () => void;
  allowedCategories: Category[];
};

export default function ExpensesButton({
  onAdded,
  allowedCategories,
}: Props) {
  const [category, setCategory] = useState<Category | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) return toast.error("Please select a category");
    if (!amount || Number(amount) <= 0)
      return toast.error("Enter a valid amount");

    const newExpense = {
      category: category.label,
      amount: Number(amount),
      note,
    };

    const res = await fetch("/api/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    });

    if (res.ok) {
      toast.success("Expense Added!");
      setAmount("");
      setCategory(null);
      setNote("");
      onAdded?.();
      setOpen(false);
    } else {
      toast.error("Failed to add expense");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 mt-4 ml-10 hover:bg-blue-700">
          <IoMdAdd className="mr-2" />
          Add New Expense
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Select category & enter the amount.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Label>Category</Label>
            <CataGory
              value={category}
              onChange={setCategory}
              allowedCategories={allowedCategories}
            />
          </div>

          <div className="grid gap-4 py-4">
            <Label>Notes</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter notes"
            />
          </div>

          <div className="grid gap-4 py-4">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
              Save Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
