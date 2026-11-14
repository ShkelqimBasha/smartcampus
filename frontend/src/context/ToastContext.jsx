import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss pas 3 sekondash (Kërkesa 6.1)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container në këndin e djathtë lart */}
      <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              toast.type === 'error'
                ? 'bg-red-50/95 border-red-200 text-red-800'
                : toast.type === 'info'
                ? 'bg-blue-50/95 border-blue-200 text-blue-800'
                : 'bg-emerald-50/95 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-start space-x-2.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              )}
              <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast duhet të përdoret brenda një ToastProvider');
  }
  return context;
};

