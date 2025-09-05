import React from 'react';

const UserCard = ({ user, onEdit, onDelete, currentUser }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      onDelete(user.id);
    }
  };

  const isCurrentUser = currentUser && currentUser.id === user.id;

  const getRoleBadgeColor = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800 border-purple-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.fullName}
              {isCurrentUser && (
                <span className="text-xs text-gray-500 ml-2">(You)</span>
              )}
            </h3>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
          </svg>
          Joined: {formatDate(user.createdAt)}
        </div>
        
        {user.updatedAt !== user.createdAt && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Updated: {formatDate(user.updatedAt)}
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(user)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit</span>
        </button>
        
        <button
          onClick={handleDelete}
          disabled={isCurrentUser}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-1 ${
            isCurrentUser 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default UserCard;
