"use client";

import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ message, type = "success", duration = 4000 }) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const Toast = ({ message, type, onClose }) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div
      className={`flex items-start gap-3 border rounded-lg px-4 py-3 shadow-lg min-w-[280px] animate-slideIn ${styles[type]}`}
    >
      <div className="mt-0.5">{icons[type]}</div>

      <p className="text-sm flex-1">{message}</p>

      <button onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};