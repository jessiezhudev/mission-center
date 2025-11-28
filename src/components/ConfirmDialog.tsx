import './ConfirmDialog.css'

interface ConfirmDialogProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}

export default function ConfirmDialog({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = '确认', 
  cancelText = '取消' 
}: ConfirmDialogProps) {
  return (
    <div className="confirm-dialog">
      <div className="confirm-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn primary" onClick={onConfirm}>{confirmText}</button>
          <button className="btn secondary" onClick={onCancel}>{cancelText}</button>
        </div>
      </div>
    </div>
  )
}