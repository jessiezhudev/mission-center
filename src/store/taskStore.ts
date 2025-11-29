import { create } from 'zustand'
import { Task, TaskStatus, TaskPriority, TaskCategory, TaskFilter } from '../types/task'

interface TaskStore {
  tasks: Task[]
  filter: TaskFilter
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setFilter: (filter: TaskFilter) => void
  getFilteredTasks: () => Task[]
}

// 生成唯一ID
const generateId = () => {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 初始化示例数据
const initialTasks: Task[] = [
  {
    id: generateId(),
    title: '完成项目文档编写',
    description: '编写项目的技术文档和用户手册',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    category: TaskCategory.WORK,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['文档', '重要'],
    estimatedHours: 8
  },
  {
    id: generateId(),
    title: '学习React Hooks',
    description: '深入学习React Hooks的使用方法和最佳实践',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    category: TaskCategory.STUDY,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['学习', 'React']
  }
]

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: initialTasks,
  filter: {},
  
  addTask: (taskData) => {
    const now = new Date().toISOString()
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    }
    set((state) => ({
      tasks: [...state.tasks, newTask]
    }))
  },
  
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    }))
  },
  
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id)
    }))
  },
  
  setFilter: (filter) => {
    set({ filter })
  },
  
  getFilteredTasks: () => {
    const { tasks, filter } = get()
    return tasks.filter((task) => {
      if (filter.status && !filter.status.includes(task.status)) return false
      if (filter.priority && !filter.priority.includes(task.priority)) return false
      if (filter.category && !filter.category.includes(task.category)) return false
      if (filter.tags && filter.tags.length > 0) {
        const hasTag = filter.tags.some((tag) => task.tags.includes(tag))
        if (!hasTag) return false
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        const matchesSearch =
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }
      return true
    })
  },

  getTaskCountByStatus: () => {
    const { tasks } = get()
    return tasks.reduce((counts, task) => {
      counts[task.status] = (counts[task.status] || 0) + 1
      return counts
    }, {} as Record<TaskStatus, number>)
  },

  getTasksByPriority: () => {
    const { tasks } = get()
    return tasks.reduce((groups, task) => {
      if (!groups[task.priority]) {
        groups[task.priority] = []
      }
      groups[task.priority].push(task)
      return groups
    }, {} as Record<TaskPriority, Task[]>)
  },

  getTasksByCategory: () => {
    const { tasks } = get()
    return tasks.reduce((groups, task) => {
      if (!groups[task.category]) {
        groups[task.category] = []
      }
      groups[task.category].push(task)
      return groups
    }, {} as Record<TaskCategory, Task[]>)
  },

  getUpcomingTasks: () => {
    const { tasks } = get()
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      return dueDate >= now && dueDate <= sevenDaysFromNow
    })
  }
}))

