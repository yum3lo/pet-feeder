import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

import { useSharedNetworkStatus } from './NetworkStatusContext';

export type ToastType = 'success' | 'error';
export type ToastPosition = 'top' | 'bottom';

type ToastState = {
  message: string;
  type: ToastType;
  position: ToastPosition;
  visible: boolean;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType, position?: ToastPosition) => void;
  toast: ToastState;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DURATION_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const { isOnline } = useSharedNetworkStatus();
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', position: 'top', visible: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success', position?: ToastPosition) => {
    const resolvedPosition = position ?? (isOnline ? 'top' : 'bottom');
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type, position: resolvedPosition, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, DURATION_MS);
  }, [isOnline]);

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
