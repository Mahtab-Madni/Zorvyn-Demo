import { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Icon } from "./Icon";
import { CAT_COLORS, CAT_ICONS } from "../utils/constants";
import { fmt, fmtDate } from "../utils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass-card rounded-xl p-3 text-xs font-body"
      style={{ border: "1px solid rgba(212,160,23,0.2)" }}
    >
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.color,
              display: "inline-block",
            }}
          />
          <span className="text-slate-300">{p.name}: </span>
          <span className="text-white font-medium">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export const DashboardPage = ({ transactions, role, onAdd }) => {
  const income = useMemo(  // Calculations of total income done in useMemo to avoid unnecessary recalculations on every render, only when transactions change
    () =>  
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const expenses = useMemo( // Calculations of total expenses done in useMemo to avoid unnecessary recalculations on every render, only when transactions change
    () =>
      transactions 
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const balance = income - expenses;
  const savings = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const monthlyData = useMemo(() => {  // Prepares monthly aggregated data for the income vs expenses chart, recalculating only when transactions change
    const months = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      if (!months[key]) months[key] = { month: key, income: 0, expenses: 0 };
      if (t.type === "income") months[key].income += t.amount;
      else months[key].expenses += t.amount;
    });
    return Object.values(months)
      .slice(-6)
      .map((m) => ({ ...m, net: m.income - m.expenses }));
  }, [transactions]);

  const categoryData = useMemo(() => {  // Prepares category-wise aggregated data for the expense breakdown chart, recalculating only when transactions change
    const cats = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  const recentTxns = transactions.slice(0, 5);

  const statCards = [
    {
      label: "Total Balance",
      value: fmt(balance),
      sub: "Current net position",
      icon: "wallet",
      color: "text-yellow-400",
      cls: "stat-balance",
      change: "+4.2%",
    },
    {
      label: "Total Income",
      value: fmt(income),
      sub: "All sources combined",
      icon: "arrow_up",
      color: "text-emerald-400",
      cls: "stat-income",
      change: "+12.1%",
    },
    {
      label: "Total Expenses",
      value: fmt(expenses),
      sub: "All categories",
      icon: "arrow_down",
      color: "text-rose-400",
      cls: "stat-expense",
      change: "+3.7%",
    },
    {
      label: "Savings Rate",
      value: `${savings.toFixed(1)}%`,
      sub: "Of total income saved",
      icon: "insights",
      color: "text-blue-400",
      cls: "stat-savings",
      change: savings > 20 ? "Healthy" : "Low",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in delay-1">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-white">
            Financial Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-body">
            Track your money, understand your patterns
          </p>
        </div>
        {role === "admin" && (
          <button
            onClick={onAdd}
            className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
          >
            <Icon name="plus" size={15} /> Add Transaction
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div
            key={s.label}
            className={`glass-card glass-card-hover stat-card ${s.cls} rounded-2xl p-5 animate-in delay-${i + 2}`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-slate-500 text-xs font-body font-medium uppercase tracking-widest">
                {s.label}
              </span>
              <span className={`${s.color} opacity-70`}>
                <Icon name={s.icon} size={16} />
              </span>
            </div>
            <div
              className={`font-mono text-3xl font-bold ${s.color} mb-1 tracking-tight`}
            >
              {s.value}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-xs font-body">{s.sub}</span>
              <span className="text-xs font-mono text-slate-500">
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Balance Trend */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-6 animate-in delay-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg text-white">
                Income vs Expenses
              </h2>
              <p className="text-slate-500 text-xs font-body mt-0.5">
                Monthly comparison over 6 months
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="income"
                name="Income"
                fill="#d4a017"
                radius={[4, 4, 0, 0]}
                opacity={0.9}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#fb7185"
                radius={[4, 4, 0, 0]}
                opacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Breakdown */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-in delay-4">
          <div className="mb-6">
            <h2 className="font-display text-lg text-white">
              Spending Breakdown
            </h2>
            <p className="text-slate-500 text-xs font-body mt-0.5">
              By category
            </p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                strokeWidth={0}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={CAT_COLORS[entry.name] || "#60a5fa"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => fmt(v)}
                contentStyle={{
                  background: "#0f2040",
                  border: "1px solid rgba(212,160,23,0.2)",
                  borderRadius: 8,
                  fontFamily: "DM Sans",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: CAT_COLORS[c.name] || "#60a5fa" }}
                  />
                  <span className="text-xs text-slate-400 font-body">
                    {c.name}
                  </span>
                </div>
                <span className="text-xs text-slate-300 font-mono">
                  {fmt(c.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card rounded-2xl p-6 animate-in delay-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg text-white">Recent Activity</h2>
            <p className="text-slate-500 text-xs font-body mt-0.5">
              Latest 5 transactions
            </p>
          </div>
        </div>
        {recentTxns.length === 0 ? (
          <div className="text-center py-10 empty-state">
            <Icon
              name="transactions"
              size={32}
              className="mx-auto mb-3 opacity-30"
            />
            <p className="font-body text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTxns.map((t, idx) => (
              <div key={t.id}>
                <div
                  className="flex items-center gap-4 p-4 rounded-xl transitions-all duration-200 hover:bg-white/[0.03] cursor-pointer hover:shadow-lg"
                  style={{
                    background: "rgba(255,255,255,0.01)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-xl font-semibold transition-transform duration-200 hover:scale-110"
                    style={{
                      background: `${CAT_COLORS[t.category]}15`,
                      border: `1.5px solid ${CAT_COLORS[t.category]}30`,
                    }}
                  >
                    {CAT_ICONS[t.category] || "💳"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-100 font-body font-semibold truncate">
                      {t.description}
                    </p>
                    <p className="text-xs text-slate-500 font-body mt-1">
                      {fmtDate(t.date)} · {t.category}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`font-mono font-bold text-sm transition-transform duration-200 hover:scale-105 inline-block ${t.type === "income" ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {fmt(t.amount)}
                    </span>
                  </div>
                </div>
                {idx < recentTxns.length - 1 && (
                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      height: 1,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
