import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, TaskCategory } from '../types/task';
import './TaskForm.css';

interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TaskForm({
  task,
  onSubmit,
  onCancel,
  isLoading = false
}: TaskFormProps) {
  const initialFormData: Partial<Task> = {
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    category: TaskCategory.OTHER,
    dueDate: '',
    tags: [],
    assignee: '',
    estimatedHours: undefined,
    ...task
  };

  const [formData, setFormData] = useState<Partial<Task>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [task]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = '任务标题不能为空';
    }

    if (!formData.description?.trim()) {
      newErrors.description = '任务描述不能为空';
    }

    if (!formData.status) {
      newErrors.status = '任务状态不能为空';
    }

    if (!formData.priority) {
      newErrors.priority = '任务优先级不能为空';
    }

    if (!formData.category) {
      newErrors.category = '任务分类不能为空';
    }

    if (formData.dueDate && isNaN(Date.parse(formData.dueDate))) {
      newErrors.dueDate = '请输入有效的截止日期';
    }

    if (formData.estimatedHours !== undefined && formData.estimatedHours <= 0) {
      newErrors.estimatedHours = '预估工时必须大于0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'tags') {
      // 处理标签输入，用逗号分隔
      const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      setFormData(prev => ({ ...prev, tags }));
      return;
    }

    if (name === 'estimatedHours') {
      // 处理预估工时输入
      const hours = value ? Number(value) : undefined;
      setFormData(prev => ({ ...prev, estimatedHours: hours }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title || '',
        description: formData.description || '',
        status: formData.status || TaskStatus.TODO,
        priority: formData.priority || TaskPriority.MEDIUM,
        category: formData.category || TaskCategory.OTHER,
        dueDate: formData.dueDate,
        tags: formData.tags || [],
        assignee: formData.assignee,
        estimatedHours: formData.estimatedHours
      };
      onSubmit(taskData);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title" className="form-label">任务标题 <span className="required">*</span></label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          disabled={isLoading}
          placeholder="请输入任务标题"
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">任务描述 <span className="required">*</span></label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          disabled={isLoading}
          rows={4}
          placeholder="请输入任务描述"
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>

      <div className="form-row">
        <div className="form-group form-group--half">
          <label htmlFor="status" className="form-label">任务状态 <span className="required">*</span></label>
          <select
            id="status"
            name="status"
            value={formData.status || TaskStatus.TODO}
            onChange={handleChange}
            className={`form-control ${errors.status ? 'is-invalid' : ''}`}
            disabled={isLoading}
          >
            <option value={TaskStatus.TODO}>待办</option>
            <option value={TaskStatus.IN_PROGRESS}>进行中</option>
            <option value={TaskStatus.REVIEW}>审核中</option>
            <option value={TaskStatus.DONE}>已完成</option>
            <option value={TaskStatus.CANCELLED}>已取消</option>
          </select>
          {errors.status && <div className="invalid-feedback">{errors.status}</div>}
        </div>

        <div className="form-group form-group--half">
          <label htmlFor="priority" className="form-label">任务优先级 <span className="required">*</span></label>
          <select
            id="priority"
            name="priority"
            value={formData.priority || TaskPriority.MEDIUM}
            onChange={handleChange}
            className={`form-control ${errors.priority ? 'is-invalid' : ''}`}
            disabled={isLoading}
          >
            <option value={TaskPriority.LOW}>低</option>
            <option value={TaskPriority.MEDIUM}>中</option>
            <option value={TaskPriority.HIGH}>高</option>
            <option value={TaskPriority.URGENT}>紧急</option>
          </select>
          {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group--half">
          <label htmlFor="category" className="form-label">任务分类 <span className="required">*</span></label>
          <select
            id="category"
            name="category"
            value={formData.category || TaskCategory.OTHER}
            onChange={handleChange}
            className={`form-control ${errors.category ? 'is-invalid' : ''}`}
            disabled={isLoading}
          >
            <option value={TaskCategory.WORK}>工作</option>
            <option value={TaskCategory.PERSONAL}>个人</option>
            <option value={TaskCategory.STUDY}>学习</option>
            <option value={TaskCategory.HEALTH}>健康</option>
            <option value={TaskCategory.FINANCE}>财务</option>
            <option value={TaskCategory.OTHER}>其他</option>
          </select>
          {errors.category && <div className="invalid-feedback">{errors.category}</div>}
        </div>

        <div className="form-group form-group--half">
          <label htmlFor="dueDate" className="form-label">截止日期</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate || ''}
            onChange={handleChange}
            className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
            disabled={isLoading}
          />
          {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group--half">
          <label htmlFor="tags" className="form-label">标签（用逗号分隔）</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={(formData.tags || []).join(', ')}
            onChange={handleChange}
            className="form-control"
            disabled={isLoading}
            placeholder="请输入标签，用逗号分隔"
          />
        </div>

        <div className="form-group form-group--half">
          <label htmlFor="assignee" className="form-label">负责人</label>
          <input
            type="text"
            id="assignee"
            name="assignee"
            value={formData.assignee || ''}
            onChange={handleChange}
            className="form-control"
            disabled={isLoading}
            placeholder="请输入负责人姓名"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="estimatedHours" className="form-label">预估工时（小时）</label>
        <input
            type="number"
            id="estimatedHours"
            name="estimatedHours"
            value={formData.estimatedHours || ''}
            onChange={handleChange}
            className={`form-control ${errors.estimatedHours ? 'is-invalid' : ''}`}
            disabled={isLoading}
            placeholder="请输入预估工时"
            min={0.5}
            step={0.5}
        />
        {errors.estimatedHours && <div className="invalid-feedback">{errors.estimatedHours}</div>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={isLoading}>
          取消
        </button>
        <button type="submit" className="btn btn--primary" disabled={isLoading}>
          {isLoading ? '处理中...' : '保存'}
        </button>
      </div>
    </form>
  );
}
