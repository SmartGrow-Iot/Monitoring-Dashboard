import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-lg rounded-xl bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 p-4">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-neutral-100"
            >
              <X size={20} className="text-neutral-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
