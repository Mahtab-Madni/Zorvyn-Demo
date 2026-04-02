import { useState } from "react";
import { Icon } from "./Icon";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../utils/constants";

export const TransactionForm = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(
    initial || {
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "Food",
      type: "expense",
      amount: "",
    },
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.description || !form.amount || !form.date)
      return alert("Please fill all fields.");
    onSave({
      ...form,
      amount: parseFloat(form.amount),
      id: initial?.id || Date.now(),
    });
    onClose();
  };

  const inputClass =
    "search-input w-full rounded-lg px-3 py-2.5 text-sm font-body";
  const labelClass =
    "block text-xs text-slate-500 mb-1 font-body font-medium uppercase tracking-wider";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Type</label>
          <select
            className={inputClass}
            value={form.type}
            onChange={(e) => {
              set("type", e.target.value);
              set("category", e.target.value === "income" ? "Salary" : "Food");
            }}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <input
          className={inputClass}
          placeholder="e.g. Monthly Salary"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {(form.type === "income"
              ? INCOME_CATEGORIES
              : EXPENSE_CATEGORIES
            ).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Amount ($)</label>
          <input
            type="number"
            className={inputClass}
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="btn-secondary flex-1 rounded-xl py-2.5 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="btn-primary flex-1 rounded-xl py-2.5 text-sm font-medium"
        >
          {initial ? "Save Changes" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
};
