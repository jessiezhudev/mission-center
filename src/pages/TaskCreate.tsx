import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '../store/taskStore'
import { TaskStatus, TaskPriority, TaskCategory } from '../types/task'
import './TaskCreate.css'

interface FormError {
  title?: string
  description?: string
  status?: string
  priority?: string
  category?: string
}

export default function TaskCreate() {
  const navigate = useNavigate()
  const addTask = useTaskStore((state) => state.addTask)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    category: TaskCategory.WORK,
    dueDate: '',
    tags: '',
    assignee: '',
    estimatedHours: 0
  })
  
  const [errors, setErrors] = useState<FormError>({})
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 表单验证
    const newErrors: FormError = {}
    if (!formData.title.trim()) newErrors.title = '任务标题不能为空'
    if (!formData.description.trim()) newErrors.description = '任务描述不能为空'
    if (!formData.status) newErrors.status = '请选择任务状态'
    if (!formData.priority) newErrors.priority = '请选择任务优先级'
    if (!formData.category) newErrors.category = '请选择任务分类'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // 处理标签转换（逗号分隔字符串转数组）
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    
    // 转换预估工时为数字
    const estimatedHours = formData.estimatedHours ? Number(formData.estimatedHours) : undefined
    
    // 创建任务
    addTask({
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
    
    // 跳转到任务列表页面
    navigate('/')
  }
  
  return (
    <div className="task-create-page">
      <h2>新建任务</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">任务标题</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'input-error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">任务描述</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={errors.description ? 'input-error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="status">任务状态</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? 'input-error' : ''}
          >
            <option value="">请选择</option>
            <option value={TaskStatus.TODO}>待办</option>
            <option value={TaskStatus.IN_PROGRESS}>进行中</option>
            <option value={TaskStatus.REVIEW}>审核中</option>
            <option value={TaskStatus.DONE}>已完成</option>
            <option value={TaskStatus.CANCELLED}>已取消</option>
          </select>
          {errors.status && <span className="error-message">{errors.status}</span>}
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
          {errors.priority && <span className="error-message">{errors.priority}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">任务分类</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'input-error' : ''}
          >
            <option value="">请选择</option>
            <option value={TaskCategory.WORK}>工作</option>
            <option value={TaskCategory.PERSONAL}>个人</option>
            <option value={TaskCategory.STUDY}>学习</option>
            <option value={TaskCategory.HEALTH}>健康</option>
            <option value={TaskCategory.FINANCE}>财务</option>
            <option value={TaskCategory.OTHER}>其他</option>
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
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
          <button type="submit" className="btn primary">创建任务</button>
          <button type="button" className="btn secondary" onClick={() => navigate('/')}>取消</button>
        </div>
      </form>
    </div>
  )
}

