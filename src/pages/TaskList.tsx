import { useTaskStore } from '../store/taskStore'
import { TaskStatus, TaskPriority, TaskCategory } from '../types/task'
import './TaskList.css'

export default function TaskList() {
  const { getFilteredTasks, filter, setFilter } = useTaskStore()
  const tasks = getFilteredTasks()

  return (
    <div className="task-list-page">
      <h2>任务列表</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="搜索任务..."
          value={filter.search || ''}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="search-input"
        />
      </div>
      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p className="empty-state">暂无任务</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

