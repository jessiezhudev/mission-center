import React from 'react';
import Modal from './Modal';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: 'primary' | 'danger' | 'default';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = '确认操作',
  message,
  confirmText = '确认',
  cancelText = '取消',
  confirmButtonColor = 'primary',
  isLoading = false
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <div className="confirm-dialog-actions">
          <button className="btn btn--secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </button>
          <button
            className={`btn btn--${confirmButtonColor}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : confirmText}
          </button>
        </div>
      }
    >
      <p className="confirm-dialog-message">{message}</p>
    </Modal>
  );
}
