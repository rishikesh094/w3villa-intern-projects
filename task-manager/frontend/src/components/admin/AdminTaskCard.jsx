import React from 'react';
import { getPriorityStyle, getStatusStyle, getStatusLabel } from '../../utils/taskUtils';

const AdminTaskCard = ({ task, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 ">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors duration-200"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors duration-200"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>
      )}
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
        </div>
        
        {task.assignee && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Assigned to: {task.assignee.fullName}</span>
          </div>
        )}
        
        {task.dueDate && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTaskCard;
