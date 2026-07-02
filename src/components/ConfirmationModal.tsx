import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Deletion',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = true,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in animate-[fadeIn_0.2s_ease-out]" id="confirmation-modal-overlay">
      <div 
        className="bg-white border border-gray-100 rounded-3xl w-full max-w-sm shadow-2xl p-6 relative flex flex-col items-center text-center space-y-4 animate-[scaleIn_0.2s_ease-out]"
        id="confirmation-modal-container"
      >
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"
          id="confirmation-modal-close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className={`p-3.5 rounded-2xl ${isDanger ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-black text-gray-900 text-sm tracking-tight">{title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed px-1">{message}</p>
        </div>

        <div className="flex gap-2 w-full pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-sm"
            id="confirmation-modal-cancel"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-white rounded-xl text-xs font-black transition-all shadow-md ${
              isDanger 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/10' 
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/10'
            }`}
            id="confirmation-modal-confirm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
