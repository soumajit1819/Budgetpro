"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Power, PowerOff } from "lucide-react";

export default function IncomeTable({
  list = [],
  onDeactivate,
  onActivate,
  onUpdate,
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const totalIncome = list
    .filter(i => i.isActive)
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const openEdit = (item) => {
    setEditing({
      _id: item._id,
      sourceName: item.sourceName,
      amount: Number(item.amount),
    });
    setOpen(true);
  };

  const submitEdit = async () => {
    if (!editing?._id) return;
    if (!editing.sourceName || editing.amount <= 0) return;

    try {
      setSaving(true);
      await onUpdate(editing._id, {
        sourceName: editing.sourceName,
        amount: Number(editing.amount),
      });
      setOpen(false);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Income Sources</h2>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {list.length > 0 ? (
                list.map(item => (
                  <TableRow
                    key={item._id}
                    className={!item.isActive ? "opacity-50" : ""}
                  >
                    <TableCell>{item.sourceName}</TableCell>
                    <TableCell>
                      ₹ {Number(item.amount).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {item.isActive ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-gray-400">Disabled</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      {/* ✅ EDIT ONLY WHEN ACTIVE */}
                      {item.isActive && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}

                      {/* ✅ TOGGLE ACTIVE / DISABLED */}
                      {item.isActive ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeactivate(item._id)}
                        >
                          <PowerOff className="h-4 w-4 text-red-500" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onActivate(item._id)}
                        >
                          <Power className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    No income added
                  </TableCell>
                </TableRow>
              )}

              {list.length > 0 && (
                <TableRow className="font-semibold bg-muted/40">
                  <TableCell>Total Active Income</TableCell>
                  <TableCell>
                    ₹ {totalIncome.toLocaleString()}
                  </TableCell>
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Source Name"
              value={editing?.sourceName || ""}
              onChange={(e) =>
                setEditing({ ...editing, sourceName: e.target.value })
              }
            />
            <Input
              type="number"
              min="1"
              placeholder="Amount"
              value={editing?.amount ?? ""}
              onChange={(e) =>
                setEditing({ ...editing, amount: Number(e.target.value) })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEdit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
