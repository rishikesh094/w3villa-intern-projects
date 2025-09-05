import React, { useState } from 'react';
import Header from './common/Header';
import StatsCard from './common/StatsCard';
import ErrorAlert from './common/ErrorAlert';
import TaskFormModal from './admin/TaskFormModal';
import AdminTaskCard from './admin/AdminTaskCard';
import UserManagement from './admin/UserManagement';
import { useTasks } from '../hooks/useTasks';
import { getTasksByStatus } from '../utils/taskUtils';

const AdminDashboard = ({ user, tasks, users, onLogout, refreshTasks, error }) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });

  const { loading, error: actionError, setError: setActionError, createTask, updateTask, deleteTask } = useTasks();

  const handleCreateTask = async () => {
    try {
      await createTask(formData, () => {
        setShowCreateModal(false);
        resetForm();
        refreshTasks();
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleEditTask = async () => {
    try {
      await updateTask(selectedTask.id, formData, () => {
        setShowEditModal(false);
        setSelectedTask(null);
        resetForm();
        refreshTasks();
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId, () => {
        refreshTasks();
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assignedTo: task.assignedTo || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: ''
    });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
    setActionError('');
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTask(null);
    resetForm();
    setActionError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header 
        title="Task Manager"
        subtitle="Admin Dashboard"
        user={user}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'tasks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Task Management</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm.5 3.5h-6v-1a4 4 0 017.87-.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>User Management</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'tasks' && (
          <div>
            {/* Task Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard 
                title="Total Tasks"
                value={tasks.length}
                icon="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                iconColor="text-gray-900"
                iconBg="bg-blue-100"
              />
              <StatsCard 
                title="Completed"
                value={getTasksByStatus(tasks, 'completed').length}
                icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                iconColor="text-green-600"
                iconBg="bg-green-100"
              />
              <StatsCard 
                title="In Progress"
                value={getTasksByStatus(tasks, 'in_progress').length}
                icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                iconColor="text-blue-600"
                iconBg="bg-blue-100"
              />
            </div>

            {/* Task Actions Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Tasks</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Task</span>
              </button>
            </div>

            <ErrorAlert error={error || actionError} onClose={() => setActionError('')} />

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <AdminTaskCard 
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTask}
                />
              ))}
              
              {tasks.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-600">Create your first task to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <UserManagement currentUser={user} />
        )}
      </main>

      {/* Create Task Modal */}
      <TaskFormModal 
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        onSubmit={handleCreateTask}
        formData={formData}
        setFormData={setFormData}
        users={users}
        loading={loading}
        error={actionError}
        setError={setActionError}
        title="Create New Task"
      />

      {/* Edit Task Modal */}
      <TaskFormModal 
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSubmit={handleEditTask}
        formData={formData}
        setFormData={setFormData}
        users={users}
        loading={loading}
        error={actionError}
        setError={setActionError}
        title="Edit Task"
      />
    </div>
  );
};

export default AdminDashboard;
