import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTaskStore } from '../store/taskStore'
import { TaskStatus, TaskPriority, TaskCategory } from '../types/task'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import PriorityBadge from '../components/PriorityBadge'
import './TaskDetail.css'

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
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

export default function TaskDetail() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { id } = useParams<{ id: string }>()
  const { tasks, deleteTask } = useTaskStore()
  const navigate = useNavigate()
  const task = tasks.find((t) => t.id === id)

  if (!task) {
    return (
      <div className="task-detail-page">
        <div className="task-not-found">
          <h2>任务不存在</h2>
          <p>你要找的任务可能已经被删除或不存在</p>
          <Link to="/" className="back-to-list-btn">
            返回任务列表
          </Link>
        </div>
      </div>
    )
  }

  // 处理删除任务
  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  // 确认删除任务
  const confirmDelete = () => {
    deleteTask(task.id)
    navigate('/')
  }

  // 取消删除
  const cancelDelete = () => {
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="task-detail-page">
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="删除任务"
        message="确定要删除这个任务吗？删除后将无法恢复。"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="删除"
        cancelText="取消"
      />
      <div className="page-actions">
        <Link to="/" className="back-btn">
          ← 返回任务列表
        </Link>
        <div className="action-buttons">
          <Link to={`/task/${task.id}/edit`} className="edit-btn">
            编辑任务
          </Link>
          <button onClick={handleDelete} className="delete-btn">
            删除任务
          </button>
        </div>
      </div>

      <div className="task-header">
  <h1 className="task-title">{task.title}</h1>
  <div className="task-badges">
    <StatusBadge status={task.status} />
    <PriorityBadge priority={task.priority} />
    <span className="category-tag">
      {TaskCategory[task.category as keyof typeof TaskCategory]}
    </span>
  </div>
</div>

      <div className="task-description">
        <h3>任务描述</h3>
        <p>{task.description}</p>
      </div>

      <div className="task-details">
        <div className="detail-group">
          <h3>基本信息</h3>
          <div className="detail-item">
  <span className="detail-label">状态：</span>
  <span className="detail-value">
    <StatusBadge status={task.status} />
  </span>
</div>
<div className="detail-item">
  <span className="detail-label">优先级：</span>
  <span className="detail-value">
    <PriorityBadge priority={task.priority} />
  </span>
</div>
          <div className="detail-item">
            <span className="detail-label">分类：</span>
            <span className="detail-value category-tag">
              {TaskCategory[task.category as keyof typeof TaskCategory]}
            </span>
          </div>
          {task.dueDate && (
            <div className="detail-item">
              <span className="detail-label">截止时间：</span>
              <span className={`detail-value due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          )}
          {task.assignee && (
            <div className="detail-item">
              <span className="detail-label">负责人：</span>
              <span className="detail-value">{task.assignee}</span>
            </div>
          )}
          {task.estimatedHours && (
            <div className="detail-item">
              <span className="detail-label">预估工时：</span>
              <span className="detail-value">{task.estimatedHours} 小时</span>
            </div>
          )}
          {task.actualHours && (
            <div className="detail-item">
              <span className="detail-label">实际工时：</span>
              <span className="detail-value">{task.actualHours} 小时</span>
            </div>
          )}
        </div>

        <div className="detail-group">
          <h3>时间信息</h3>
          <div className="detail-item">
            <span className="detail-label">创建时间：</span>
            <span className="detail-value">{formatDate(task.createdAt)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">更新时间：</span>
            <span className="detail-value">{formatDate(task.updatedAt)}</span>
          </div>
        </div>

        {task.tags.length > 0 && (
          <div className="detail-group">
            <h3>标签</h3>
            <div className="tags-list">
              {task.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

