import { useTaskStore } from '../store/taskStore'
import { TaskStatus, TaskPriority, TaskCategory } from '../types/task'
import './TaskList.css'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import PriorityIndicator from '../components/PriorityIndicator'
import CategoryTag from '../components/CategoryTag'

export default function TaskList() {
  const { getFilteredTasks, filter, setFilter } = useTaskStore()
  const tasks = getFilteredTasks()
  const navigate = useNavigate()

  // 状态筛选处理
  const handleStatusChange = (status: TaskStatus, e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = filter.status ? [...filter.status] : []
    if (e.target.checked) {
      newStatus.push(status)
    } else {
      const index = newStatus.indexOf(status)
      if (index > -1) {
        newStatus.splice(index, 1)
      }
    }
    setFilter({ ...filter, status: newStatus.length > 0 ? newStatus : undefined })
  }

  // 优先级筛选处理
  const handlePriorityChange = (priority: TaskPriority, e: React.ChangeEvent<HTMLInputElement>) => {
    const newPriority = filter.priority ? [...filter.priority] : []
    if (e.target.checked) {
      newPriority.push(priority)
    } else {
      const index = newPriority.indexOf(priority)
      if (index > -1) {
        newPriority.splice(index, 1)
      }
    }
    setFilter({ ...filter, priority: newPriority.length > 0 ? newPriority : undefined })
  }

  // 分类筛选处理
  const handleCategoryChange = (category: TaskCategory, e: React.ChangeEvent<HTMLInputElement>) => {
    const newCategory = filter.category ? [...filter.category] : []
    if (e.target.checked) {
      newCategory.push(category)
    } else {
      const index = newCategory.indexOf(category)
      if (index > -1) {
        newCategory.splice(index, 1)
      }
    }
    setFilter({ ...filter, category: newCategory.length > 0 ? newCategory : undefined })
  }

  // 检查任务是否已过期
  const isTaskExpired = (dueDate?: string) => {
    if (!dueDate) return false
    const today = new Date()
    const taskDueDate = new Date(dueDate)
    return taskDueDate < today
  }

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
        
        <div className="filter-group">
          <h4>任务状态</h4>
          <div className="filter-options">
            {Object.entries(TaskStatus).map(([key, value]) => (
              <label key={key} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filter.status?.includes(value)}
                  onChange={(e) => handleStatusChange(value, e)}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <h4>任务优先级</h4>
          <div className="filter-options">
            {Object.entries(TaskPriority).map(([key, value]) => (
              <label key={key} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filter.priority?.includes(value)}
                  onChange={(e) => handlePriorityChange(value, e)}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <h4>任务分类</h4>
          <div className="filter-options">
            {Object.entries(TaskCategory).map(([key, value]) => (
              <label key={key} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filter.category?.includes(value)}
                  onChange={(e) => handleCategoryChange(value, e)}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p className="empty-state">暂无任务</p>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`task-card ${isTaskExpired(task.dueDate) ? 'expired' : ''}`}
              onClick={() => navigate(`/task/${task.id}`)}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <StatusBadge status={task.status} />
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <PriorityIndicator priority={task.priority} />
                <CategoryTag category={task.category} />
                {task.dueDate && (
                  <span className="due-date">
                    截止日期: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              {task.tags.length > 0 && (
                <div className="task-tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

