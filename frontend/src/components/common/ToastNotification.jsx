import React, { useEffect } from 'react';

export const ToastNotification = ({ show, title, message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-space-lg py-space-md rounded-xl shadow-xl flex items-center gap-space-md transition-all duration-300 animate-slide-up">
      <span className="material-symbols-outlined text-primary-fixed">task_alt</span>
      <div className="flex flex-col">
        <span className="font-label-md text-label-md font-semibold text-white">{title}</span>
        <span className="font-body-sm text-body-sm opacity-80 text-surface-container-high">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-surface-dim hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};

export default ToastNotification;
