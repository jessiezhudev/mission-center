import { TaskPriority } from '../types/task'
import './PriorityIndicator.css'

interface PriorityIndicatorProps {
  priority: TaskPriority
}

export default function PriorityIndicator({ priority }: PriorityIndicatorProps) {
  return (
    <span className={`priority-indicator ${priority}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}