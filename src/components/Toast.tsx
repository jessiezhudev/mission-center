import React, { useState, useEffect } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  showIcon?: boolean;
}

export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  showIcon = true
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 等待动画完成后再关闭
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // 等待动画完成后再关闭
  };

  return (
    <div className={`toast toast--${type} ${isVisible ? 'toast--visible' : 'toast--hidden'}`}>
      {showIcon && <span className="toast__icon">{getIcon()}</span>}
      <span className="toast__message">{message}</span>
      <button className="toast__close-btn" onClick={handleClose}>
        ×
      </button>
    </div>
  );
}

// Toast容器组件
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
    showIcon?: boolean;
  }>;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({
  toasts,
  onClose,
  position = 'top-right'
}: ToastContainerProps) {
  return (
    <div className={`toast-container toast-container--${position}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          showIcon={toast.showIcon}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
}
