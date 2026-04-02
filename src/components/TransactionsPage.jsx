import { useState, useMemo } from "react";
import { Icon } from "./Icon";
import { CAT_COLORS } from "../utils/constants";
import { fmt, fmtFull, fmtDate } from "../utils/helpers";

export const TransactionsPage = ({
  transactions,
  role,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const allCategories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))].sort(),
    [transactions],
  );

  const filtered = useMemo(() => {
    let r = [...transactions];
    if (search)
      r = r.filter(
        (t) =>
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase()),
      );
    if (filterType !== "all") r = r.filter((t) => t.type === filterType);
    if (filterCategory !== "all")
      r = r.filter((t) => t.category === filterCategory);
    r.sort((a, b) => {
      let va = a[sortKey],
        vb = b[sortKey];
      if (sortKey === "date") {
        va = new Date(va);
        vb = new Date(vb);
      }
      if (sortKey === "amount") {
        va = +va;
        vb = +vb;
      }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
    return r;
  }, [transactions, search, filterType, filterCategory, sortKey, sortDir]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const exportCSV = () => {
    const csv = (() => {
      const rows = [["Date", "Description", "Category", "Type", "Amount"]];
      filtered.forEach((t) =>
        rows.push([t.date, t.description, t.category, t.type, t.amount]),
      );
      return rows
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");
    })();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k)
      return <Icon name="sort" size={13} className="opacity-20" />;
    return sortDir === "asc" ? (
      <Icon name="up" size={13} className="text-yellow-400" />
    ) : (
      <Icon name="down" size={13} className="text-yellow-400" />
    );
  };

  const inputClass = "search-input rounded-xl px-4 py-2.5 text-sm font-body";

  return (
    <div className="space-y-5 animate-in delay-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-white">
            Transactions
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-body">
            {filtered.length} of {transactions.length} records
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={exportCSV}
            className="btn-secondary px-3 sm:px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Icon name="download" size={14} />{" "}
            <span className="hidden sm:inline">Export</span>
          </button>
          {role === "admin" && (
            <button
              onClick={onAdd}
              className="btn-primary px-3 sm:px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
            >
              <Icon name="plus" size={15} />{" "}
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 flex flex-col gap-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">
            <Icon name="search" size={14} />
          </span>
          <input
            className={`${inputClass} w-full pl-9`}
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-none sm:flex">
          <select
            className={`${inputClass} w-full sm:w-auto sm:flex-1`}
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            className={`${inputClass} w-full sm:w-auto sm:flex-1`}
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Categories</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table/Cards */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {[
                  ["date", "Date"],
                  ["description", "Description"],
                  ["category", "Category"],
                  ["type", "Type"],
                  ["amount", "Amount"],
                ].map(([k, label]) => (
                  <th key={k} className="text-left px-5 py-4">
                    <button
                      onClick={() => toggleSort(k)}
                      className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-widest font-body font-medium hover:text-slate-300 transition-colors whitespace-nowrap"
                    >
                      {label} <SortIcon k={k} />
                    </button>
                  </th>
                ))}
                {role === "admin" && <th className="px-5 py-4" />}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 empty-state">
                    <Icon
                      name="search"
                      size={28}
                      className="mx-auto mb-3 opacity-30"
                    />
                    <p className="font-body text-sm">
                      No transactions match your filters
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((t) => (
                  <tr
                    key={t.id}
                    className="table-row hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  >
                    <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap text-sm">
                      {fmtDate(t.date)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-200 font-body text-sm">
                      {t.description}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="tag-chip text-sm"
                        style={{
                          background: `${CAT_COLORS[t.category]}18`,
                          color: CAT_COLORS[t.category],
                          border: `1px solid ${CAT_COLORS[t.category]}30`,
                        }}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`tag-chip text-sm ${t.type === "income" ? "badge-income" : "badge-expense"}`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3.5 font-mono font-semibold whitespace-nowrap text-sm ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {fmtFull(t.amount)}
                    </td>
                    {role === "admin" && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => onEdit(t)}
                            className="p-1.5 text-slate-600 hover:text-yellow-400 transition-colors"
                          >
                            <Icon name="edit" size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this transaction?"))
                                onDelete(t.id);
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-400 transition-colors"
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {paginated.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Icon
                name="search"
                size={28}
                className="mx-auto mb-3 opacity-30"
              />
              <p className="font-body text-sm">
                No transactions match your filters
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {paginated.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl p-4 transition-colors hover:bg-white/[0.02]"
                  style={{
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-100 truncate">
                        {t.description}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {fmtDate(t.date)}
                      </p>
                    </div>
                    <span
                      className={`font-mono font-bold text-sm whitespace-nowrap flex-shrink-0 ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {fmtFull(t.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="tag-chip text-xs"
                      style={{
                        background: `${CAT_COLORS[t.category]}18`,
                        color: CAT_COLORS[t.category],
                        border: `1px solid ${CAT_COLORS[t.category]}30`,
                      }}
                    >
                      {t.category}
                    </span>
                    <span
                      className={`tag-chip text-xs ${t.type === "income" ? "badge-income" : "badge-expense"}`}
                    >
                      {t.type === "income" ? "Income" : "Expense"}
                    </span>
                  </div>
                  {role === "admin" && (
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
                      <button
                        onClick={() => onEdit(t)}
                        className="flex-1 p-2 text-xs text-slate-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-white/[0.05]"
                      >
                        <Icon name="edit" size={14} className="inline mr-1" />{" "}
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this transaction?"))
                            onDelete(t.id);
                        }}
                        className="flex-1 p-2 text-xs text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/[0.05]"
                      >
                        <Icon name="trash" size={14} className="inline mr-1" />{" "}
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 sm:px-5 py-3 sm:py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-xs text-slate-600 font-body">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-3 sm:px-4 py-1.5 rounded-lg text-xs disabled:opacity-30"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary px-3 sm:px-4 py-1.5 rounded-lg text-xs disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
