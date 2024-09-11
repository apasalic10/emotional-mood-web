import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '../../hooks/useQuery';
import { Link } from 'react-router-dom';
import API from '../../axios.js';
import Section from '../../components/Section.jsx';

const fetchUsers = async (token) => {
  const response = await API.get('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data ?? [];
};

const UserCard = ({ user, isAdmin, onDelete }) => (
  <div className="p-6 transition-shadow duration-200 bg-white border border-gray-200 rounded-lg hover:shadow-md">
    <Link to={`/users/${user._id}`} className="block">
      <div className="flex items-center mb-4 space-x-4">
        <img
          className="w-12 h-12 rounded-full"
          src={user.avatarUrl || 'https://picsum.photos/200'}
          alt={user.name}
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {user?.fullname ? user.fullname : `${user.firstname} ${user.lastname}`}
          </h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="text-sm text-gray-700">
        <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        <p>Total Entries: {user.entryCount || 0}</p>
      </div>
    </Link>
    {isAdmin && (
      <div className="mt-4 space-x-2">
        <Link
          to={`/users/${user._id}/edit`}
          className="px-3 py-1 mr-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(user._id)}
          className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    )}
  </div>
);

const Users = () => {
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.user.isAdmin);
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery(['users', token], () => fetchUsers(token));

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        refetch(); // Refresh the user list
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  if (isLoading) return <div className="py-10 text-center">Loading users...</div>;
  if (error)
    return (
      <div className="py-10 text-center text-red-500">Error loading users: {error.message}</div>
    );

  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <Section title="User Management" gridCols={1}>
        <div className="mb-6">
          <p className="text-gray-600">Total users: {users.length}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user._id} user={user} isAdmin={isAdmin} onDelete={handleDelete} />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Users;
