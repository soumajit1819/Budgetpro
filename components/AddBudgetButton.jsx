"use client";

import { Button } from "@/components/ui/button";
import CataGory from "@/components/CataGory";
import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

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

export default function AddBudgetButton({ onAdded }) {
  const [category, setCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !category.label || !category.emoji) {
      toast.error("Please select a valid category");
      return;
    }

    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    const now = new Date();
    const month = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    try {
      setLoading(true);

      const res = await axios.post("/api/budget", {
        category: category.label,
        emoji: category.emoji,
        amount: amountNum,
        month,
      });

      if (res.status === 201) {
        toast.success("Budget added");
        setAmount("");
        setCategory(null);
        setOpen(false);
        onAdded?.();
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||  // <--- check 'message' first
        err?.response?.data?.error ||
        "Failed to add budget";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="ml-10">
          <Button
            variant="outline"
            className="bg-blue-700 mt-4 ml-10 border-0 hover:bg-blue-500 hover:text-white text-white"
          >
            <IoMdAdd className="mr-1" /> Add New Budget
          </Button>
        </span>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Your New Budget</DialogTitle>
            <DialogDescription>
              Select a category and enter the budget amount.
            </DialogDescription>
          </DialogHeader>

          {/* Category */}
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label>Category</Label>
              <CataGory
                value={category}
                onChange={setCategory}
              />
            </div>
          </div>

          {/* Amount */}
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label>Budget Amount</Label>
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter budget"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {loading ? "Saving..." : "Save Budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
