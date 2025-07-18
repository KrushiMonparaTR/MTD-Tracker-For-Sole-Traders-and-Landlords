import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className={`bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-screen overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertCircle className={`h-6 w-6 ${isDestructive ? 'text-red-400' : 'text-yellow-400'}`} />
        </div>
        <div className="flex-1">
          <p className="text-slate-300">{message}</p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-slate-300 hover:text-slate-100 border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isDestructive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  const typeClasses = {
    success: 'bg-green-900/20 border-green-600 text-green-200',
    error: 'bg-red-900/20 border-red-600 text-red-200',
    warning: 'bg-yellow-900/20 border-yellow-600 text-yellow-200',
    info: 'bg-blue-900/20 border-blue-600 text-blue-200'
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full border rounded-lg p-4 shadow-lg ${typeClasses[type]}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 text-current opacity-70 hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Modal;
