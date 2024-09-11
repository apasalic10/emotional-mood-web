import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../axios.js';
import { useSelector } from 'react-redux';

const AddUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();

  const addUserMutation = useMutation({
    mutationFn: (newUser) =>
      API.post(`/api/users/register`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user', userId]);
      navigate('/users');
    },
    onError: (error) => {
      console.error('Error updating user:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      email: formData.get('email'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      username: formData.get('username'),
      password: formData.get('password'),
      isAdmin: false,
    };
    addUserMutation.mutate(newUser);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Dodaj korisnika</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                Ime{' '}
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Prezime
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleGoBack}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Nazad
              </button>
              <button
                type="submit"
                className="px-3 py-1 mr-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100"
              >
                Potvrdi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
