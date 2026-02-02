import { useState, useCallback } from 'react';
import type { ToastMessage, ToastType } from '../components/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message: string) => {
    showToast('success', title, message);
  }, [showToast]);

  const error = useCallback((title: string, message: string) => {
    showToast('error', title, message);
  }, [showToast]);

  const warning = useCallback((title: string, message: string) => {
    showToast('warning', title, message);
  }, [showToast]);

  const info = useCallback((title: string, message: string) => {
    showToast('info', title, message);
  }, [showToast]);

  return {
    toasts,
    closeToast,
    success,
    error,
    warning,
    info,
  };
}
