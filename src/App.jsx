import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardPage } from "./components/DashboardPage";
import { TransactionsPage } from "./components/TransactionsPage";
import { InsightsPage } from "./components/InsightsPage";
import { Modal } from "./components/Modal";
import { TransactionForm } from "./components/TransactionForm";
import { Icon } from "./components/Icon";
import { Footer } from "./components/Footer";
import { INITIAL_TRANSACTIONS } from "./utils/dataGenerator";
import "./App.css";

function App() {
  const [page, setPage] = useState("dashboard");
  const [role, setRole] = useState("admin");
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("fv_txns");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      console.warn("Failed to load transactions from localStorage.");
      return INITIAL_TRANSACTIONS;
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("fv_txns", JSON.stringify(transactions));
    } catch {
      console.warn("Failed to save transactions to localStorage.");
    }
  }, [transactions]);

  const handleAdd = () => {
    setEditTxn(null);
    setShowModal(true);
  };

  const handleEdit = (t) => {
    setEditTxn(t);
    setShowModal(true);
  };

  const handleDelete = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const handleSave = (txn) => {
    if (editTxn) {
      setTransactions((prev) => prev.map((t) => (t.id === txn.id ? txn : t)));
    } else {
      setTransactions((prev) => [txn, ...prev]);
    }
  };

  return (
    <div
      className="flex min-h-screen relative"
      style={{ position: "relative" }}
    >
      <div className="mesh-bg" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 transform transition-transform duration-300 ease-out md:static md:w-64 md:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40 flex-shrink-0`}
      >
        <Sidebar
          active={page}
          setActive={setPage}
          role={role}
          setRole={setRole}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen relative z-10">
        {/* Mobile topbar */}
        <div
          className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3"
          style={{
            background: "rgba(7,17,31,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 p-1.5"
          >
            <Icon name="menu" size={20} />
          </button>
          <span className="font-display text-base gold-text">FinVault</span>
          <div
            className={`tag-chip text-xs ${role === "admin" ? "role-badge-admin" : "role-badge-viewer"}`}
          >
            {role}
          </div>
        </div>

        <main className="px-4 md:px-8 py-6 md:py-10 pt-16 md:pt-10 max-w-5xl">
          {page === "dashboard" && (
            <DashboardPage
              transactions={transactions}
              role={role}
              onAdd={handleAdd}
            />
          )}
          {page === "transactions" && (
            <TransactionsPage
              transactions={transactions}
              role={role}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {page === "insights" && <InsightsPage transactions={transactions} />}
        </main>
        <Footer />
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          title={editTxn ? "Edit Transaction" : "New Transaction"}
          onClose={() => setShowModal(false)}
        >
          <TransactionForm
            initial={editTxn}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
