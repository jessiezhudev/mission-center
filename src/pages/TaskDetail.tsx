import { useParams } from 'react-router-dom'
import { useTaskStore } from '../store/taskStore'
import './TaskDetail.css'

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const { tasks } = useTaskStore()
  const task = tasks.find((t) => t.id === id)

  if (!task) {
    return <div>任务不存在</div>
  }

  return (
    <div className="task-detail-page">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </div>
  )
}

