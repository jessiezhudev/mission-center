// 任务状态枚举
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

// 任务优先级枚举
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// 任务分类枚举
export enum TaskCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  STUDY = 'study',
  HEALTH = 'health',
  FINANCE = 'finance',
  OTHER = 'other'
}

// 任务实体接口
export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  assignee?: string
  estimatedHours?: number
  actualHours?: number
}

// 任务筛选条件
export interface TaskFilter {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  category?: TaskCategory[]
  tags?: string[]
  search?: string
}

