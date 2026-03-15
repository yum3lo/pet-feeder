import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

export type ToastType = 'success' | 'error';

type ToastState = {
  message: string;
  type: ToastType;
  visible: boolean;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
  toast: ToastState;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
