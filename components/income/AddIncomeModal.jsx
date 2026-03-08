"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddIncomeModal({
  open,
  onClose,
  initialData,
  onSuccess, // 🔥 parent will refetch
}) {
  const isEdit = Boolean(initialData);

  const [sourceName, setSourceName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSourceName(initialData.sourceName ?? "");
      setAmount(initialData.amount?.toString() ?? "");
    } else {
      setSourceName("");
      setAmount("");
    }
  }, [initialData, open]);

  async function handleSubmit() {
    if (!sourceName.trim() || !amount) {
      toast.error("Source name and amount required");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await axios.put("/api/income/update", {
          id: initialData._id,
          sourceName: sourceName.trim(),
          amount: Number(amount),
        });
        toast.success("Income updated");
      } else {
        await axios.post("/api/income/add", {
          sourceName: sourceName.trim(),
          amount: Number(amount),
        });
        toast.success("Income added");
      }

      onClose();
      onSuccess?.(); // 🔥 refetch parent data
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Income save failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Income" : "Add Income"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Source Name"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEdit
              ? "Update"
              : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
