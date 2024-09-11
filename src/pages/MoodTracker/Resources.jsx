import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../axios.js';
import Section from '../../components/Section.jsx';

const EducationResources = () => {
  const [newResource, setNewResource] = useState({ title: '', description: '', url: '' });
  const [editingResource, setEditingResource] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.user.isAdmin);
  const queryClient = useQueryClient();

  const fetchResources = async () => {
    const response = await API.get('/api/educationMaterials', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const {
    data: resources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['educationResources'],
    queryFn: fetchResources,
  });

  const addResourceMutation = useMutation({
    mutationFn: (newResource) =>
      API.post('/api/educationMaterials', newResource, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationResources'] });
      setNewResource({ title: '', description: '', url: '' });
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: (updatedResource) =>
      API.put(`/api/educationMaterials/${updatedResource._id}`, updatedResource, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationResources'] });
      setEditingResource(null);
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: (id) =>
      API.delete(`/api/educationMaterials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educationResources'] });
    },
  });

  const handleAddResource = (e) => {
    e.preventDefault();
    addResourceMutation.mutate(newResource);
  };

  const handleUpdateResource = () => {
    updateResourceMutation.mutate(editingResource);
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteResourceMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <Section title="Education Resources" gridCols={1}>
        <div className="p-8 bg-white border border-gray-200 rounded-2xl">
          {isAdmin && (
            <form onSubmit={handleAddResource} className="mb-8 space-y-4">
              <input
                type="text"
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="Title"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                placeholder="Description"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                placeholder="URL"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Resource
              </button>
            </form>
          )}

          <ul className="space-y-6">
            {resources.map((resource) => (
              <li key={resource._id} className="p-6 bg-white border border-gray-200 rounded-xl ">
                {editingResource && editingResource._id === resource._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingResource.title}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editingResource.description}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      value={editingResource.url}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, url: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleUpdateResource}
                      className="px-3 py-1 mr-2 text-sm text-green-600 border border-green-600 rounded hover:bg-green-100"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{resource.title}</h3>
                      <p className="mt-2 text-gray-600">{resource.description}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-blue-500 transition-colors hover:text-blue-600"
                      >
                        Learn More →
                      </a>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingResource(resource)}
                          className="p-2 text-blue-600 transition-colors rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource._id)}
                          className="p-2 text-red-600 transition-colors rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
};

export default EducationResources;
