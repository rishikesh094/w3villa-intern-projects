import React, { useState, useEffect} from 'react';
import api from '../utils/api';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchTasks();
    
    if (user.role === 'admin') {
      fetchUsers();
    }
  }, [user.role]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.tasks || []);
    } catch (error) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/tasks/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      onLogout();
    }
  };

  const refreshTasks = () => {
    fetchTasks();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {console.log(user)}
      {console.log(users)}
      {user.role === 'admin' ? (
        <AdminDashboard 
          user={user}
          tasks={tasks}
          users={users}
          onLogout={handleLogout}
          refreshTasks={refreshTasks}
          error={error}
        />
      ) : (
        <UserDashboard 
          user={user}
          tasks={tasks}
          onLogout={handleLogout}
          refreshTasks={refreshTasks}
          error={error}
        />
      )}
    </div>
  );
};

export default Dashboard;
