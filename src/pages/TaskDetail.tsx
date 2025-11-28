import { useParams, useNavigate } from 'react-router-dom'
import { useTaskStore } from '../store/taskStore'
import { TaskStatus, TaskPriority, TaskCategory } from '../types/task'
import { useState } from 'react'
import './TaskDetail.css'
import StatusBadge from '../components/StatusBadge'
import PriorityIndicator from '../components/PriorityIndicator'
import CategoryTag from '../components/CategoryTag'
import ConfirmDialog from '../components/ConfirmDialog'

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, updateTask, deleteTask } = useTaskStore()
  const task = tasks.find((t) => t.id === id)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // 表单状态管理
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || TaskStatus.TODO,
    priority: task?.priority || TaskPriority.MEDIUM,
    category: task?.category || TaskCategory.WORK,
    dueDate: task?.dueDate || '',
    tags: task?.tags.join(', ') || '',
    assignee: task?.assignee || '',
    estimatedHours: task?.estimatedHours || 0
  })

  if (!task) {
    return <div>任务不存在</div>
  }

  // 处理表单字段变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 处理任务更新
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 处理标签转换（逗号分隔字符串转数组）
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    
    // 转换预估工时为数字
    const estimatedHours = formData.estimatedHours ? Number(formData.estimatedHours) : undefined
    
    // 更新任务
    updateTask(task.id, {
      title: formData.title,
      description: formData.description,
      status: formData.status as TaskStatus,
      priority: formData.priority as TaskPriority,
      category: formData.category as TaskCategory,
      dueDate: formData.dueDate || undefined,
      tags,
      assignee: formData.assignee || undefined,
      estimatedHours
    })
    
    // 退出编辑模式
    setIsEditing(false)
  }

  // 处理任务删除
  const handleDelete = () => {
    deleteTask(task.id)
    navigate('/')
  }

  // 检查任务是否已过期
  const isTaskExpired = (dueDate?: string) => {
    if (!dueDate) return false
    const today = new Date()
    const taskDueDate = new Date(dueDate)
    return taskDueDate < today
  }

  // 快速状态切换
  const handleStatusQuickChange = (status: TaskStatus) => {
    updateTask(task.id, { status })
  }

  return (
    <div className="task-detail-page">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="task-edit-form">
          <div className="form-group">
            <label htmlFor="title">任务标题</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">任务描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">任务状态</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value={TaskStatus.TODO}>待办</option>
              <option value={TaskStatus.IN_PROGRESS}>进行中</option>
              <option value={TaskStatus.REVIEW}>审核中</option>
              <option value={TaskStatus.DONE}>已完成</option>
              <option value={TaskStatus.CANCELLED}>已取消</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>任务优先级</label>
            <div className="radio-group">
              {Object.entries(TaskPriority).map(([key, value]) => (
                <label key={key} className="radio-label">
                  <input
                    type="radio"
                    name="priority"
                    value={value}
                    checked={formData.priority === value}
                    onChange={handleChange}
                  />
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="category">任务分类</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value={TaskCategory.WORK}>工作</option>
              <option value={TaskCategory.PERSONAL}>个人</option>
              <option value={TaskCategory.STUDY}>学习</option>
              <option value={TaskCategory.HEALTH}>健康</option>
              <option value={TaskCategory.FINANCE}>财务</option>
              <option value={TaskCategory.OTHER}>其他</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="dueDate">截止日期</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">标签（逗号分隔）</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="例如: 工作, 重要"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="assignee">负责人</label>
            <input
              type="text"
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="estimatedHours">预估工时（小时）</label>
            <input
              type="number"
              id="estimatedHours"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              min="0"
              step="0.5"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn primary">保存</button>
            <button type="button" className="btn secondary" onClick={() => setIsEditing(false)}>取消</button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-header">
            <h2>{task.title}</h2>
            <div className="task-actions">
              <button className="btn secondary" onClick={() => setIsEditing(true)}>编辑</button>
              <button className="btn danger" onClick={() => setShowDeleteConfirm(true)}>删除</button>
              <button className="btn secondary" onClick={() => navigate('/')}>返回</button>
            </div>
          </div>
          
          <div className="task-meta">
            <StatusBadge status={task.status} />
            <PriorityIndicator priority={task.priority} />
            <CategoryTag category={task.category} />
            {task.dueDate && (
              <span className={`due-date ${isTaskExpired(task.dueDate) ? 'expired' : ''}`}>
                截止日期: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
          
          <div className="task-description">
            <h3>任务描述</h3>
            <p>{task.description}</p>
          </div>
          
          <div className="task-details">
            {task.tags.length > 0 && (
              <div className="detail-item">
                <label>标签:</label>
                <div className="task-tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            
            {task.assignee && (
              <div className="detail-item">
                <label>负责人:</label>
                <span>{task.assignee}</span>
              </div>
            )}
            
            {task.estimatedHours && (
              <div className="detail-item">
                <label>预估工时:</label>
                <span>{task.estimatedHours} 小时</span>
              </div>
            )}
            
            {task.actualHours && (
              <div className="detail-item">
                <label>实际工时:</label>
                <span>{task.actualHours} 小时</span>
              </div>
            )}
            
            <div className="detail-item">
              <label>创建时间:</label>
              <span>{new Date(task.createdAt).toLocaleString()}</span>
            </div>
            
            <div className="detail-item">
              <label>更新时间:</label>
              <span>{new Date(task.updatedAt).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="status-actions">
            <h3>快速状态切换</h3>
            <div className="status-buttons">
              {Object.entries(TaskStatus).map(([key, value]) => (
                <button 
                  key={key}
                  className={`btn status-btn ${value}`}
                  onClick={() => handleStatusQuickChange(value)}
                  disabled={task.status === value}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="确认删除"
          message="您确定要删除这个任务吗？"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText="删除"
          cancelText="取消"
        />
      )}
    </div>
  )
}

