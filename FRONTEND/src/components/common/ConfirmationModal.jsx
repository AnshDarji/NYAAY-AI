import React from 'react';
import Button from './Button';

export default function ConfirmationModal({
  isOpen,
  title,
  body,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-zinc-900 mb-2">{title}</h3>
          <p className="text-zinc-500 text-sm">{body}</p>
        </div>
        
        <div className="bg-zinc-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-zinc-100">
          <Button 
            variant="secondary" 
            onClick={onCancel}
            disabled={loading}
            className="!px-4 !py-2 !text-sm"
          >
            {cancelText}
          </Button>
          <Button 
            variant={isDestructive ? 'danger' : 'primary'} 
            onClick={onConfirm}
            loading={loading}
            className="!px-4 !py-2 !text-sm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
