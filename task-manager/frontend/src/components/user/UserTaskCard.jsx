import React, { useState } from 'react';
import { getPriorityStyle, getStatusStyle, isOverdue, getDaysUntilDue } from '../../utils/taskUtils';
import { STATUSES } from '../../constants/taskConstants';

const UserTaskCard = ({ task, onStatusUpdate, loading }) => {
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
                const statusObj = STATUSES.find(s => s.value === status);
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
            {STATUSES.find(s => s.value === task.status)?.label || task.status}
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

export default UserTaskCard;
