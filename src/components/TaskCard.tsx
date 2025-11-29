import React from 'react';
import { Task, TaskStatus, TaskPriority, TaskCategory } from '../types/task';
import { FaEdit, FaTrash, FaClock, FaTag } from 'react-icons/fa';
import './TaskCard.css';

// 状态映射到标签文本和颜色
const STATUS_MAP: Record<TaskStatus, { text: string; color: string }> = {
  [TaskStatus.TODO]: { text: '待办', color: '#808080' },
  [TaskStatus.IN_PROGRESS]: { text: '进行中', color: '#165DFF' },
  [TaskStatus.REVIEW]: { text: '审核中', color: '#FF9A00' },
  [TaskStatus.DONE]: { text: '已完成', color: '#00B42A' },
  [TaskStatus.CANCELLED]: { text: '已取消', color: '#F53F3F' }
};

// 优先级映射到标签文本和颜色
const PRIORITY_MAP: Record<TaskPriority, { text: string; color: string }> = {
  [TaskPriority.LOW]: { text: '低', color: '#808080' },
  [TaskPriority.MEDIUM]: { text: '中', color: '#FF9A00' },
  [TaskPriority.HIGH]: { text: '高', color: '#F53F3F' },
  [TaskPriority.URGENT]: { text: '紧急', color: '#F53F3F' }
};

// 分类映射到标签文本和颜色
const CATEGORY_MAP: Record<TaskCategory, { text: string; color: string }> = {
  [TaskCategory.WORK]: { text: '工作', color: '#165DFF' },
  [TaskCategory.PERSONAL]: { text: '个人', color: '#00B42A' },
  [TaskCategory.STUDY]: { text: '学习', color: '#722ED1' },
  [TaskCategory.HEALTH]: { text: '健康', color: '#F53F3F' },
  [TaskCategory.FINANCE]: { text: '财务', color: '#FF9A00' },
  [TaskCategory.OTHER]: { text: '其他', color: '#808080' }
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  // 检查任务是否过期
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`task-card ${isOverdue ? 'task-card--overdue' : ''}`}>
      <div className="task-card__header">
        <div className="task-card__actions">
          <button 
            className="task-card__action-btn task-card__action-btn--edit"
            onClick={() => onEdit(task)}
            aria-label="编辑任务"
          >
            <FaEdit />
          </button>
          <button 
            className="task-card__action-btn task-card__action-btn--delete"
            onClick={() => onDelete(task.id)}
            aria-label="删除任务"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="task-card__content">
          <h3 className="task-card__title">{task.title}</h3>
          
          <p className="task-card__description">{task.description}</p>
          
          <div className="task-card__details">
            {task.dueDate && (
              <div className="task-card__detail-item">
                <span className="task-card__detail-label">截止日期:</span>
                <span className={`task-card__detail-value ${isOverdue ? 'text-overdue' : ''}`}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            )}
            
            {task.estimatedHours && (
              <div className="task-card__detail-item">
                <span className="task-card__detail-label">
                  <FaClock className="task-card__detail-icon" />
                  预估工时:
                </span>
                <span className="task-card__detail-value">{task.estimatedHours} 小时</span>
              </div>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="task-card__detail-item">
                <span className="task-card__detail-label">
                  <FaTag className="task-card__detail-icon" />
                  标签:
                </span>
                <span className="task-card__detail-value">{task.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      
      <div className="task-card__footer">
        <div className="task-card__tags">
          <span 
            className="task-card__tag task-card__tag--status"
            style={{ backgroundColor: `${STATUS_MAP[task.status].color}20`, color: STATUS_MAP[task.status].color }}
          >
            {STATUS_MAP[task.status].text}
          </span>
          
          <span 
            className="task-card__tag task-card__tag--priority"
            style={{ backgroundColor: `${PRIORITY_MAP[task.priority].color}20`, color: PRIORITY_MAP[task.priority].color }}
          >
            {PRIORITY_MAP[task.priority].text}
          </span>
          
          <span 
            className="task-card__tag task-card__tag--category"
            style={{ backgroundColor: `${CATEGORY_MAP[task.category].color}20`, color: CATEGORY_MAP[task.category].color }}
          >
            {CATEGORY_MAP[task.category].text}
          </span>
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className="task-card__custom-tags">
            {task.tags.map((tag, index) => (
              <span key={index} className="task-card__custom-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
