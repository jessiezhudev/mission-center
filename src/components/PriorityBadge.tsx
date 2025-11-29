import React from 'react'
import { TaskPriority } from '../types/task'
import './PriorityBadge.css'

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const priorityText = TaskPriority[priority as keyof typeof TaskPriority]
  return (
    <span className={`priority-badge ${priority}`}>
      {priorityText}
    </span>
  )
}