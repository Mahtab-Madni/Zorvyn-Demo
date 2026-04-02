import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Icon } from "./Icon";
import { CAT_COLORS } from "../utils/constants";
import { fmt } from "../utils/helpers";

// Custom Tooltip Component - Outside render to prevent recreation
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass-card rounded-xl p-3 text-xs font-body"
      style={{ border: "1px solid rgba(212,160,23,0.2)" }}
    >
      <p className="text-slate-400 mb-2">{label}</p>
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

export const InsightsPage = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const catTotals = useMemo(() => {
    const cats = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value, pct: (value / expenses) * 100 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, expenses]);

  const monthlyData = useMemo(() => {
    const months = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      if (!months[key])
        months[key] = { month: key, income: 0, expenses: 0, order: d };
      if (t.type === "income") months[key].income += t.amount;
      else months[key].expenses += t.amount;
    });
    return Object.values(months)
      .sort((a, b) => a.order - b.order)
      .map((m) => ({ ...m, net: m.income - m.expenses }));
  }, [transactions]);

  const lastMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const expenseChange = prevMonth
    ? ((lastMonth?.expenses - prevMonth?.expenses) / prevMonth?.expenses) * 100
    : 0;

  const insights = [
    {
      cls: "insight-gold",
      icon: "🏆",
      title: "Top Spending Category",
      value: catTotals[0]?.name || "—",
      desc: catTotals[0]
        ? `${fmt(catTotals[0].value)} spent — ${catTotals[0].pct.toFixed(1)}% of total expenses`
        : "No data",
    },
    {
      cls: expenseChange > 0 ? "insight-red" : "insight-green",
      icon: expenseChange > 0 ? "📈" : "📉",
      title: "Monthly Expense Trend",
      value: `${expenseChange > 0 ? "+" : ""}${expenseChange.toFixed(1)}%`,
      desc: `${lastMonth?.month}: ${fmt(lastMonth?.expenses)} vs ${prevMonth?.month}: ${fmt(prevMonth?.expenses)}`,
    },
    {
      cls:
        savingsRate >= 20
          ? "insight-green"
          : savingsRate >= 10
            ? "insight-gold"
            : "insight-red",
      icon: savingsRate >= 20 ? "✅" : "⚠️",
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      desc:
        savingsRate >= 20
          ? "Excellent! Above the recommended 20% threshold."
          : savingsRate >= 10
            ? "Fair. Try to push above 20% for financial health."
            : "Below recommended threshold. Review your expenses.",
    },
    {
      cls: "insight-blue",
      icon: "💡",
      title: "Avg. Monthly Expense",
      value: fmt(expenses / Math.max(monthlyData.length, 1)),
      desc: `Based on ${monthlyData.length} months of data tracked`,
    },
  ];

  return (
    <div className="space-y-6 animate-in delay-1">
      <div>
        <h1 className="font-display text-2xl md:text-3xl text-white">
          Insights
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-body">
          Patterns and observations from your financial data
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((ins, i) => (
          <div
            key={i}
            className={`glass-card glass-card-hover insight-card ${ins.cls} rounded-2xl p-5 animate-in delay-${i + 2}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{ins.icon}</span>
              <div className="flex-1">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-body font-medium">
                  {ins.title}
                </p>
                <p className="font-display text-xl text-white mt-1">
                  {ins.value}
                </p>
                <p className="text-xs text-slate-500 font-body mt-1 leading-relaxed">
                  {ins.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Net Trend */}
      <div className="glass-card rounded-2xl p-6 animate-in delay-3">
        <div className="mb-5">
          <h2 className="font-display text-lg text-white">
            Net Cash Flow Trend
          </h2>
          <p className="text-slate-500 text-xs font-body mt-0.5">
            Income minus expenses each month
          </p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4a017" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="net"
              name="Net"
              stroke="#d4a017"
              strokeWidth={2}
              fill="url(#netGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card rounded-2xl p-6 animate-in delay-4">
        <div className="mb-5">
          <h2 className="font-display text-lg text-white">
            Expense Categories
          </h2>
          <p className="text-slate-500 text-xs font-body mt-0.5">
            Where your money goes
          </p>
        </div>
        <div className="space-y-4">
          {catTotals.map((c) => (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-body text-slate-300">
                  {c.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">
                    {c.pct.toFixed(1)}%
                  </span>
                  <span className="text-sm font-mono text-slate-200 w-24 text-right">
                    {fmt(c.value)}
                  </span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${c.pct}%`,
                    background: CAT_COLORS[c.name] || "#60a5fa",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
