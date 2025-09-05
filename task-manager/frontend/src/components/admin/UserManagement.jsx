import { useState, useEffect } from 'react';
import UserCard from './UserCard';
import UserFormModal from './UserFormModal';
import StatsCard from '../common/StatsCard';
import ErrorAlert from '../common/ErrorAlert';
import LoadingSpinner from '../common/LoadingSpinner';
import { useUsers } from '../../hooks/useUsers';

const UserManagement = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'user'
  });

  const {
    loading,
    error,
    setError,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    fetchUserStats
  } = useUsers();

  // Load users and stats on component mount
  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await fetchUserStats();
      setUserStats(stats);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser(formData, () => {
        setShowCreateModal(false);
        resetForm();
        loadUsers();
        loadUserStats();
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUser(selectedUser.id, formData, () => {
        setShowEditModal(false);
        setSelectedUser(null);
        resetForm();
        loadUsers();
        loadUserStats();
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId, () => {
        loadUsers();
        loadUserStats();
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'user'
    });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
    setError('');
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
    setError('');
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={userStats.totalUsers}
            icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm.5 3.5h-6v-1a4 4 0 017.87-.5M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <StatsCard
            title="Admin Users"
            value={userStats.adminUsers}
            icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
          <StatsCard
            title="Regular Users"
            value={userStats.regularUsers}
            icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <StatsCard
            title="Recent Users"
            value={userStats.recentUsers}
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
          />
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            {/* Create User Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      <ErrorAlert error={error} onClose={() => setError('')} />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      )}

      {/* Users Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              currentUser={currentUser}
              onEdit={openEditModal}
              onDelete={handleDeleteUser}
            />
          ))}

          {filteredUsers.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm.5 3.5h-6v-1a4 4 0 017.87-.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || roleFilter !== 'all' ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first user to get started.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create User Modal */}
      <UserFormModal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        onSubmit={handleCreateUser}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        error={error}
        setError={setError}
        title="Create New User"
      />

      {/* Edit User Modal */}
      <UserFormModal
        isOpen={showEditModal}
        onClose={closeEditModal}
        onSubmit={handleEditUser}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        error={error}
        setError={setError}
        title="Edit User"
      />
    </div>
  );
};

export default UserManagement;
