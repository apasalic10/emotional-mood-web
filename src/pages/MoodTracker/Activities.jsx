import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../axios.js';
import Section from '../../components/Section.jsx';

const fetchActivities = async ({ queryKey }) => {
  const [_, token] = queryKey;
  const response = await API.get('/api/activities', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const Activities = () => {
  const token = useSelector((state) => state.auth.token);
  const queryClient = useQueryClient();
  const [newActivity, setNewActivity] = useState('');
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editingActivityName, setEditingActivityName] = useState('');

  const {
    data: activities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['activities', token],
    queryFn: fetchActivities,
  });

  const addActivityMutation = useMutation({
    mutationFn: (newActivity) =>
      API.post(
        '/api/activities',
        { name: newActivity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      setNewActivity('');
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: (updatedActivity) =>
      API.put(`/api/activities/${updatedActivity.id}`, updatedActivity, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      setEditingActivityId(null);
      setEditingActivityName('');
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (activityId) =>
      API.delete(`/api/activities/${activityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activities'] }),
  });

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (newActivity.trim()) {
      addActivityMutation.mutate(newActivity);
    }
  };

  const handleUpdateActivity = () => {
    updateActivityMutation.mutate({ id: editingActivityId, name: editingActivityName });
  };

  const handleDeleteActivity = (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      deleteActivityMutation.mutate(activityId);
    }
  };

  const startEditing = (activity) => {
    setEditingActivityId(activity._id);
    setEditingActivityName(activity.name);
  };

  if (isLoading) return <div className="py-10 text-center">Loading activities...</div>;
  if (error)
    return (
      <div className="py-10 text-center text-red-500">
        Error loading activities: {error.message}
      </div>
    );

  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <Section title="Upravljanje aktivnostima" gridCols={1}>
        {/* Helper text */}
        <div className="p-4 mb-2 border-l-4 border-blue-500 rounded-md bg-blue-50">
          <h3 className="mb-2 text-lg font-semibold text-blue-800">Šta su aktivnosti?</h3>
          <p className="text-blue-700">
            Aktivnosti su radnje ili događaji koji mogu uticati na vaše emocije. Pomažu vam da
            pratite šta ste radili kada ste doživjeli određena raspoloženja, omogućavajući vam da
            prepoznate obrasce i potencijalno pozitivne ili negativne uticaje na vaše emocionalno
            stanje.
          </p>
          <p className="mt-2 text-blue-700">
            Primjeri: vježbanje, čitanje, druženje, rad ili meditacija.
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          {/* Add new activity form */}
          <form onSubmit={handleAddActivity} className="mb-6">
            <div className="flex">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Unesi novu aktivnost"
                className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Dodaj
              </button>
            </div>
          </form>

          {/* Activities list */}
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li
                key={activity._id}
                className="flex items-center justify-between p-4 rounded-md bg-gray-50"
              >
                {editingActivityId === activity._id ? (
                  <input
                    type="text"
                    value={editingActivityName}
                    onChange={(e) => setEditingActivityName(e.target.value)}
                    className="flex-grow px-2 py-1 mr-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span>{activity.name}</span>
                )}
                <div>
                  {editingActivityId === activity._id ? (
                    <button
                      onClick={handleUpdateActivity}
                      className="px-3 py-1 mr-2 text-sm text-green-600 border border-green-600 rounded hover:bg-green-100"
                    >
                      Spremi
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(activity)}
                      className="px-3 py-1 mr-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100"
                    >
                      Uredi
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteActivity(activity._id)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100"
                  >
                    Obriši
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
};

export default Activities;
