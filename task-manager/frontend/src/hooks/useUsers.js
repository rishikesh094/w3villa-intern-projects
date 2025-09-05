import { useState } from 'react';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../utils/userApi';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      return data.users;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id) => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserById(id);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createNewUser = async (userData, onSuccess) => {
    setLoading(true);
    setError('');
    try {
      const data = await createUser(userData);
      if (onSuccess) onSuccess(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingUser = async (id, userData, onSuccess) => {
    setLoading(true);
    setError('');
    try {
      const data = await updateUser(id, userData);
      if (onSuccess) onSuccess(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id, onSuccess) => {
    setLoading(true);
    setError('');
    try {
      await deleteUser(id);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUserStats();
      return data.stats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    fetchUsers,
    fetchUserById,
    createUser: createNewUser,
    updateUser: updateExistingUser,
    deleteUser: removeUser,
    fetchUserStats
  };
};
