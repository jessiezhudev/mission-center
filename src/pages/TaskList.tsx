import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Task, TaskStatus, TaskPriority, TaskCategory } from '../types/task';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { ToastContainer, ToastType } from '../components/Toast';
import './TaskList.css';

export default function TaskList() {
  const { getFilteredTasks, filter, setFilter, addTask, updateTask, deleteTask } = useTaskStore();
  const tasks = getFilteredTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
    showIcon?: boolean;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 添加提示消息
  const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  // 移除提示消息
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // 处理创建任务
  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      // 模拟异步请求
      await new Promise(resolve => setTimeout(resolve, 500));
      addTask(taskData);
      setIsCreateModalOpen(false);
      addToast('任务创建成功', 'success');
    } catch (error) {
      addToast('任务创建失败', 'error');
      setIsLoading(false);
    }
  };

  // 处理编辑任务
  const handleEditTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedTask) return;
    try {
      setIsLoading(true);
      // 模拟异步请求
      await new Promise(resolve => setTimeout(resolve, 500));
      updateTask(selectedTask.id, taskData);
      setIsEditModalOpen(false);
      setSelectedTask(null);
      addToast('任务更新成功', 'success');
    } catch (error) {
      addToast('任务更新失败', 'error');
      setIsLoading(false);
    }
  };

  // 处理删除任务
  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      setIsLoading(true);
      // 模拟异步请求
      await new Promise(resolve => setTimeout(resolve, 500));
      deleteTask(selectedTask.id);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
      addToast('任务删除成功', 'success');
    } catch (error) {
      addToast('任务删除失败', 'error');
      setIsLoading(false);
    }
  };

  // 打开编辑模态框
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // 打开删除确认框
  const openDeleteModal = (taskId: string) => {
    setSelectedTask(tasks.find(task => task.id === taskId) || null);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="task-list-page">
      <div className="task-list-header">
        <h2>任务列表</h2>
        <button 
          className="btn btn--primary"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isLoading}
        >
          + 快速创建任务
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="搜索任务..."
          value={filter.search || ''}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="search-input"
        />
      </div>

      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <p className="empty-state">暂无任务</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))
        )}
      </div>

      {/* 创建任务模态框 */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="快速创建任务"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* 编辑任务模态框 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="编辑任务"
      >
        <TaskForm
          task={selectedTask}
          onSubmit={handleEditTask}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="确认删除任务"
        message={`确定要删除任务“${selectedTask?.title}”吗？`}
        confirmText="删除"
        cancelText="取消"
        confirmButtonColor="danger"
        isLoading={isLoading}
      />

      {/* 提示消息容器 */}
      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
        position="top-right"
      />
    </div>
  )
}

