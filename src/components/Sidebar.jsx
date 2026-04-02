import { Icon } from "./Icon";

export const Sidebar = ({
  active,
  setActive,
  role,
  setRole,
  onClose,
}) => {
  const navLinks = [
    { id: "dashboard", label: "Overview", icon: "dashboard" },
    { id: "transactions", label: "Transactions", icon: "transactions" },
    { id: "insights", label: "Insights", icon: "insights" },
  ];

  return (
    <div
      className={`sidebar fixed left-0 top-0 h-screen w-64 flex flex-col z-40`}
      style={{
        background: "#07111f",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <div
        className="px-6 pt-8 pb-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}
          >
            <Icon
              name="wallet"
              size={16}
              className="text-navy-950"
              style={{ color: "#050d1a" }}
            />
          </div>
          <div>
            <span className="font-display text-lg font-bold gold-text">
              FinVault
            </span>
            <p className="text-xs text-slate-600 font-body -mt-0.5">
              Personal Finance
            </p>
          </div>
        </div>
      </div>

      {/* Role Selector */}
      <div
        className="px-4 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-xs text-slate-600 uppercase tracking-widest mb-2 px-2 font-body font-medium">
          Active Role
        </p>
        <div className="grid grid-cols-2 gap-2">
          {["admin", "viewer"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`py-2 rounded-xl text-xs font-body font-semibold capitalize transition-all ${role === r ? (r === "admin" ? "role-badge-admin" : "role-badge-viewer") : "text-slate-600 hover:text-slate-400"}`}
              style={{
                background: role === r ? undefined : "rgba(255,255,255,0.02)",
                border:
                  role === r ? undefined : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {r === "admin" ? "👨🏻‍💻" : "👁"} {r}
            </button>
          ))}
        </div>
        {role === "admin" ? (
          <p className="text-xs text-yellow-700 font-body mt-2 px-1">
            Admin: full read/write access
          </p>
        ) : (
          <p className="text-xs text-blue-800 font-body mt-2 px-1">
            Viewer: read-only access
          </p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs text-slate-700 uppercase tracking-widest mb-3 px-3 font-body font-medium">
          Navigation
        </p>
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => {
              setActive(link.id);
              onClose && onClose();
            }}
            className={`sidebar-link w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium text-left ${active === link.id ? "active" : "text-slate-600"}`}
          >
            <Icon name={link.icon} size={16} />
            {link.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-6 py-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <p className="text-xs text-slate-700 font-body">© 2026 FinVault</p>
        <p className="text-xs text-slate-800 font-body mt-0.5">
          Mock data · For demo purposes only
        </p>
      </div>
    </div>
  );
};
