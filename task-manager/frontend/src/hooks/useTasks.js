import { useState } from 'react';
import api from '../utils/api';

export const useTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createTask = async (taskData, onSuccess) => {
    setLoading(true);
    setError('');
    
    try {
      await api.post('/tasks', taskData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, taskData, onSuccess) => {
    setLoading(true);
    setError('');
    
    try {
      await api.put(`/tasks/${taskId}`, taskData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status, onSuccess) => {
    setLoading(true);
    setError('');
    
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId, onSuccess) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      throw err;
    }
  };

  return {
    loading,
    error,
    setError,
    createTask,
    updateTask,  
    updateTaskStatus,
    deleteTask
  };
};
