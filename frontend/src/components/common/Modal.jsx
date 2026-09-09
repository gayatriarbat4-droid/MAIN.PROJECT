import React, { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, subtitle, children }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-md px-margin-mobile transition-all">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-space-xl shadow-2xl space-y-space-lg transform transition-all border border-outline-variant/30">
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
          <div>
            {subtitle && (
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                {subtitle}
              </span>
            )}
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              {title}
            </h3>
          </div>
          <button
            className="p-space-xs rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
