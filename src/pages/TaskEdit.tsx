import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTaskStore } from '../store/taskStore'
import { TaskStatus, TaskPriority, TaskCategory } from '../types/task'
import './TaskEdit.css'

export default function TaskEdit() {
  const { id } = useParams<{ id: string }>()
  const { tasks, updateTask } = useTaskStore()
  const navigate = useNavigate()
  const task = tasks.find(t => t.id === parseInt(id || '', 10))

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    category: TaskCategory.WORK,
    dueDate: '',
    tags: '',
    assignee: '',
    estimatedHours: ''
  })
  const [errors, setErrors] = useState({})

  // 初始化表单数据
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate || '',
        tags: task.tags ? task.tags.join(', ') : '',
        assignee: task.assignee || '',
        estimatedHours: task.estimatedHours ? task.estimatedHours.toString() : ''
      })
    }
  }, [task])

  // 表单验证
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.title.trim()) {
      newErrors.title = '任务标题不能为空'
    }
    if (!formData.description.trim()) {
      newErrors.description = '任务描述不能为空'
    }
    if (formData.estimatedHours && isNaN(Number(formData.estimatedHours))) {
      newErrors.estimatedHours = '预估工时必须是数字'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm() && task) {
      const updatedTaskData = {
        ...task,
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
        updatedAt: new Date().toISOString()
      }
      updateTask(updatedTaskData)
      navigate('/task/' + id)
    }
  }

  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!task) {
    return (
      <div className="task-edit-page">
        <h2>编辑任务</h2>
        <p className="task-not-found">任务未找到</p>
        <button onClick={() => navigate('/')} className="back-to-list-btn">
          返回任务列表
        </button>
      </div>
    )
  }

  return (
    <div className="task-edit-page">
      <h2>编辑任务</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">任务标题 <span className="required">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'invalid' : ''}
            placeholder="输入任务标题"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">任务描述 <span className="required">*</span></label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'invalid' : ''}
            placeholder="输入任务详细描述"
            rows={4}
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
          >
            <option value={TaskStatus.TODO}>待办</option>
            <option value={TaskStatus.IN_PROGRESS}>进行中</option>
            <option value={TaskStatus.REVIEW}>待审核</option>
            <option value={TaskStatus.DONE}>已完成</option>
            <option value={TaskStatus.CANCELLED}>已取消</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">优先级</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value={TaskPriority.LOW}>低</option>
            <option value={TaskPriority.MEDIUM}>中</option>
            <option value={TaskPriority.HIGH}>高</option>
            <option value={TaskPriority.URGENT}>紧急</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">分类</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          <label htmlFor="dueDate">截止时间</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">标签 (逗号分隔)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="例如：重要, 紧急, 文档"
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
            placeholder="输入负责人姓名"
          />
        </div>

        <div className="form-group">
          <label htmlFor="estimatedHours">预估工时 (小时)</label>
          <input
            type="number"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleChange}
            min="0"
            step="0.5"
            placeholder="输入预估工时"
            className={errors.estimatedHours ? 'invalid' : ''}
          />
          {errors.estimatedHours && <span className="error-message">{errors.estimatedHours}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/task/' + id)} className="cancel-btn">
            取消
          </button>
          <button type="submit" className="submit-btn">
            保存修改
          </button>
        </div>
      </form>
    </div>
  )
}