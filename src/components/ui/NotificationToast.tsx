import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 3500 }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, title, message, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />,
            info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
          };

          const borders = {
            success: 'border-emerald-200 bg-white shadow-md',
            error: 'border-red-200 bg-white shadow-md',
            info: 'border-blue-200 bg-white shadow-md',
            warning: 'border-amber-200 bg-white shadow-md',
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs transition-all duration-200 ${borders[toast.type]}`}
            >
              <div className="flex items-start gap-2.5">
                {icons[toast.type]}
                <div>
                  <div className="font-semibold text-slate-900 leading-snug">{toast.title}</div>
                  {toast.message && (
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                      {toast.message}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
