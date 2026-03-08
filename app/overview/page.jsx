"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import IncomeCards from "@/components/income/IncomeCards";
import IncomeTable from "@/components/income/IncomeTable";
import AddIncomeButton from "@/components/income/AddIncomeButton";
import AddIncomeModal from "@/components/income/AddIncomeModal";

const initialDashboard = {
  totalIncome: 0,
  activeIncome: 0,
  inactiveIncome: 0,
};

export default function IncomePage() {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, listRes] = await Promise.all([
        axios.get("/api/income/dashboard"),
        axios.get("/api/income/list"),
      ]);

      setDashboard(dashboardRes.data || initialDashboard);
      setList(Array.isArray(listRes.data) ? listRes.data : []);
    } catch {
      toast.error("Failed to load income data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addIncome = async (data) => {
    try {
      setLoading(true);
      await axios.post("/api/income/add", data);
      toast.success("Income added");
      setOpenAddModal(false);
      await loadData();
    } catch {
      toast.error("Add income failed");
    } finally {
      setLoading(false);
    }
  };

  const deactivateIncome = async (id) => {
    if (!id || typeof id !== "string") return;

    try {
      setLoading(true);
      await axios.patch(`/api/income/deactivate/${id}`);
      toast.success("Income deactivated");
      await loadData();
    } catch {
      toast.error("Deactivate failed");
    } finally {
      setLoading(false);
    }
  };
  const activateIncome = async (id) => {
  if (!id || typeof id !== "string") return;

  try {
    setLoading(true);

    await axios.put(`/api/income/status/${id}`, {
      isActive: true,
    });

    toast.success("Income activated");
    await loadData();
  } catch {
    toast.error("Activate failed");
  } finally {
    setLoading(false);
  }
};


  const updateIncome = async (id, data) => {
  if (!id || typeof id !== "string") {
    console.error("INVALID ID PASSED:", id);
    toast.error("Invalid income ID");
    return;
  }

  // 🔥 whitelist only allowed fields
  const payload = {
    sourceName: data.sourceName,
    amount: Number(data.amount),
    month: data.month,
    isActive: data.isActive,
  };

  // remove undefined values
  Object.keys(payload).forEach(
    key => payload[key] === undefined && delete payload[key]
  );

  if (Object.keys(payload).length === 0) {
    toast.error("Nothing to update");
    return;
  }

  try {
    setLoading(true);

    await axios.put(`/api/income/update/${id}`, payload);

    toast.success("Income updated");
    await loadData();

  } catch (err) {
    console.error("UPDATE ERROR:", err?.response?.data || err);

    const msg =
      err?.response?.data?.error ||
      "Update failed";

    toast.error(msg);

  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 space-y-6">
      <IncomeCards data={dashboard} />

      <div className="flex justify-end">
        <AddIncomeButton
          onClick={() => setOpenAddModal(true)}
          disabled={loading}
        />
      </div>

      <IncomeTable
        list={list}
        loading={loading}
        onDeactivate={deactivateIncome}
        onActivate={activateIncome}
        onUpdate={updateIncome}
      />

      <AddIncomeModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={addIncome}
      />
    </div>
  );
}
