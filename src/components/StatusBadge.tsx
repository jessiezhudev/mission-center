import React from 'react'
import { TaskStatus } from '../types/task'
import './StatusBadge.css'

interface StatusBadgeProps {
  status: TaskStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusText = TaskStatus[status as keyof typeof TaskStatus]
  return (
    <span className={`status-badge ${status}`}>
      {statusText}
    </span>
  )
}