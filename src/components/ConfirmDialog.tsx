import React from 'react'
import './ConfirmDialog.css'

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = '确认',
  cancelText = '取消'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-dialog-content">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-actions">
          <button onClick={onCancel} className="cancel-btn">{cancelText}</button>
          <button onClick={onConfirm} className="confirm-btn">{confirmText}</button>
        </div>
      </div>
    </div>
  )
}