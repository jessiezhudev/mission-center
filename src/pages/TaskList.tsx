import { useTaskStore } from '../store/taskStore'
import { TaskStatus, TaskPriority, TaskCategory } from '../types/task'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import './TaskList.css'

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 检查任务是否过期
const isOverdue = (dueDate?: string) => {
  if (!dueDate) return false
  const today = new Date()
  const due = new Date(dueDate)
  due.setHours(23, 59, 59, 999) // 设置为当天的最后一刻
  return due < today
}

export default function TaskList() {
  const { tasks, getFilteredTasks, filter, setFilter } = useTaskStore()
  const filteredTasks = getFilteredTasks()

  // 处理筛选变化
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    if (value === 'all') {
      const newFilter = { ...filter }
      delete newFilter[name]
      setFilter(newFilter)
    } else {
      setFilter({ ...filter, [name]: value })
    }
  }

  // 处理搜索变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value })
  }

  // 获取唯一的分类列表
  const uniqueCategories = [...new Set(tasks.map(task => task.category))]

  return (
    <div className="task-list-page">
      <div className="page-header">
        <h2>任务列表</h2>
        <p className="task-count">共 {filteredTasks.length} 个任务</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="status-filter">状态：</label>
          <select
            id="status-filter"
            name="status"
            value={filter.status || 'all'}
            onChange={handleFilterChange}
          >
            <option value="all">全部</option>
            <option value={TaskStatus.TODO}>待办</option>
            <option value={TaskStatus.IN_PROGRESS}>进行中</option>
            <option value={TaskStatus.REVIEW}>待审核</option>
            <option value={TaskStatus.DONE}>已完成</option>
            <option value={TaskStatus.CANCELLED}>已取消</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter">优先级：</label>
          <select
            id="priority-filter"
            name="priority"
            value={filter.priority || 'all'}
            onChange={handleFilterChange}
          >
            <option value="all">全部</option>
            <option value={TaskPriority.LOW}>低</option>
            <option value={TaskPriority.MEDIUM}>中</option>
            <option value={TaskPriority.HIGH}>高</option>
            <option value={TaskPriority.URGENT}>紧急</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="category-filter">分类：</label>
          <select
            id="category-filter"
            name="category"
            value={filter.category || 'all'}
            onChange={handleFilterChange}
          >
            <option value="all">全部</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {TaskCategory[category as keyof typeof TaskCategory]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="搜索任务标题、描述或标签..."
          value={filter.search || ''}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="tasks-grid">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>暂无任务</p>
            <Link to="/task/new" className="create-task-btn">
              创建第一个任务
            </Link>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <Link to={`/task/${task.id}`} key={task.id} className={`task-card ${task.status}`}>
              <div className="task-header">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <span className="category-tag">
                  {TaskCategory[task.category as keyof typeof TaskCategory]}
                </span>
                {task.dueDate && (
                  <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                    截止：{formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

