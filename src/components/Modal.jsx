import { Icon } from "./Icon";

export const Modal = ({ title, onClose, children }) => (
  <div
    className="modal-backdrop"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="modal-box glass-card rounded-2xl w-full max-w-md mx-4 p-6"
      style={{ border: "1px solid rgba(212,160,23,0.2)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl text-white">{title}</h3>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors p-1"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);
