'use client';
import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      icon: FaCheckCircle,
      bg: 'bg-green-500/20',
      border: 'border-green-500',
      text: 'text-green-400',
    },
    error: {
      icon: FaExclamationCircle,
      bg: 'bg-red-500/20',
      border: 'border-red-500',
      text: 'text-red-400',
    },
    info: {
      icon: FaInfoCircle,
      bg: 'bg-blue-500/20',
      border: 'border-blue-500',
      text: 'text-blue-400',
    },
    warning: {
      icon: FaExclamationCircle,
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
    },
  };

  const current = types[type] || types.info;
  const Icon = current.icon;

  return (
    <div className={`fixed top-24 right-4 z-50 max-w-sm w-full animate-slideIn`}>
      <div className={`
        flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md
        ${current.bg} ${current.border}
      `}>
        <Icon className={`${current.text} text-xl flex-shrink-0 mt-0.5`} />
        <p className="text-white flex-1 text-sm">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition flex-shrink-0"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
}