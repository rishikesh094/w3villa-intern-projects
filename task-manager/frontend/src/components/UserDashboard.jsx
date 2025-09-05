import { useState } from 'react';
import api from '../utils/api';
import { PRIORITIES, STATUSES } from '../constants/taskConstants';
import Header from './common/Header';
import StatsCard from './common/StatsCard';

const UserDashboard = ({ user, tasks, onLogout, refreshTasks, error }) => {
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleStatusUpdate = async (taskId, newStatus) => {
    setLoading(true);
    setActionError('');

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      refreshTasks();
    } catch (error) {
      setActionError(error.response?.data?.message || 'Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = (priority) => {
    const style = PRIORITIES.find(p => p.value === priority);
    return style ? style.color : 'text-gray-600 bg-gray-100';
  };

  const getStatusStyle = (status) => {
    const style = STATUSES.find(s => s.value === status);
    return style ? style.color : 'text-gray-600 bg-gray-100';
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <Header user={user} title={"My Tasks"} subtitle={"User Dashboard"} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title={"Total Tasks"} value={tasks.length} icon={"M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"} iconColor='text-gray-900'/>
          <StatsCard title={"Pending"} value={getTasksByStatus('pending').length} icon={"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"} iconColor='text-gray-600'/>
          <StatsCard title={"In Progress"} value={getTasksByStatus('in_progress').length} icon={"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} iconColor='text-blue-600'/>
          <StatsCard title={"Completed"} value={getTasksByStatus('completed').length} icon={"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} iconColor='text-green-600' />
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Welcome back, {user.fullName}!</h2>
              <p className="text-blue-100">You have {tasks.filter(t => t.status !== 'completed').length} active tasks to work on.</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {(error || actionError) && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <p className="text-red-700">{error || actionError}</p>
          </div>
        )}

        {/* Tasks Section */}
        <div className="space-y-8">
          {/* Pending Tasks */}
          {getTasksByStatus('pending').length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Pending Tasks ({getTasksByStatus('pending').length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTasksByStatus('pending').map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusUpdate={handleStatusUpdate}
                    getPriorityStyle={getPriorityStyle}
                    getStatusStyle={getStatusStyle}
                    isOverdue={isOverdue}
                    getDaysUntilDue={getDaysUntilDue}
                    loading={loading}
                    statuses={STATUSES}
                  />
                ))}
              </div>
            </div>
          )}

          {/* In Progress Tasks */}
          {getTasksByStatus('in_progress').length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                In Progress ({getTasksByStatus('in_progress').length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTasksByStatus('in_progress').map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusUpdate={handleStatusUpdate}
                    getPriorityStyle={getPriorityStyle}
                    getStatusStyle={getStatusStyle}
                    isOverdue={isOverdue}
                    getDaysUntilDue={getDaysUntilDue}
                    loading={loading}
                    statuses={STATUSES}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {getTasksByStatus('completed').length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed ({getTasksByStatus('completed').length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTasksByStatus('completed').map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusUpdate={handleStatusUpdate}
                    getPriorityStyle={getPriorityStyle}
                    getStatusStyle={getStatusStyle}
                    isOverdue={isOverdue}
                    getDaysUntilDue={getDaysUntilDue}
                    loading={loading}
                    statuses={STATUSES}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No Tasks */}
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks assigned yet</h3>
              <p className="text-gray-600">You don't have any tasks assigned to you at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">Check back later or contact your administrator for new assignments.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onStatusUpdate, getPriorityStyle, getStatusStyle, isOverdue, getDaysUntilDue, loading, statuses }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const taskIsOverdue = isOverdue(task.dueDate);

  const getNextStatuses = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return ['in_progress'];
      case 'in_progress':
        return ['completed'];
      case 'completed':
        return ['in_progress', 'pending'];
      default:
        return [];
    }
  };

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] ${taskIsOverdue && task.status !== 'completed' ? 'border-red-300 bg-red-50/60' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">{task.title}</h3>
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
            title="Change status"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-32">
              {getNextStatuses(task.status).map((status) => {
                const statusObj = statuses.find(s => s.value === status);
                return (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusUpdate(task.id, status);
                      setShowStatusMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={statusObj.icon} />
                    </svg>
                    <span>{statusObj.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
            {statuses.find(s => s.value === task.status)?.label || task.status}
          </span>
        </div>

        {task.creator && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Created by: {task.creator.fullName}</span>
          </div>
        )}

        {task.dueDate && (
          <div className={`flex items-center text-sm ${taskIsOverdue && task.status !== 'completed' ? 'text-red-600' : 'text-gray-600'}`}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {taskIsOverdue && task.status !== 'completed' && ' (Overdue)'}
              {daysUntilDue !== null && daysUntilDue > 0 && task.status !== 'completed' && ` (${daysUntilDue} days left)`}
              {daysUntilDue === 0 && task.status !== 'completed' && ' (Due today)'}
            </span>
          </div>
        )}

        {task.createdAt && (
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showStatusMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowStatusMenu(false)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
