import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons/Icons';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  const containerClasses = isSuccess 
    ? 'bg-green-50 border-status-green text-status-green-text' 
    : 'bg-red-50 border-status-red text-status-red-text';

  return (
    <div 
      className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg border-l-4 ${containerClasses}`}
      role="alert"
    >
      <div className="flex-shrink-0">
        {isSuccess ? <CheckCircleIcon className="w-6 h-6" /> : <XCircleIcon className="w-6 h-6" />}
      </div>
      <div className="ml-3 text-sm font-medium">
        {message}
      </div>
      <button 
        type="button" 
        className="ml-4 -mr-1.5 -my-1.5 bg-transparent rounded-lg p-1.5 inline-flex h-8 w-8 text-current hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

export default Notification;