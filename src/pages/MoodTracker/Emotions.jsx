import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../axios.js';
import Section from '../../components/Section.jsx';

const fetchEmotions = async (token) => {
  const response = await API.get('/api/emotions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data ?? [];
};

const addEmotion = async ({ token, emotion }) => {
  const response = await API.post('/api/emotions', emotion, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteEmotion = async ({ token, id }) => {
  await API.delete(`/api/emotions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const updateEmotion = async ({ token, id, emotion }) => {
  const response = await API.put(`/api/emotions/${id}`, emotion, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const EmotionCard = ({ emotion, onDelete, onEdit, isAdmin }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmotion, setEditedEmotion] = useState(emotion);

  const handleEdit = () => {
    onEdit(emotion._id, editedEmotion);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <input
          type="text"
          value={editedEmotion.name}
          onChange={(e) =>
            setEditedEmotion({ ...editedEmotion, id: editedEmotion._id, name: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          value={editedEmotion.reaction}
          onChange={(e) =>
            setEditedEmotion({ ...editedEmotion, id: editedEmotion._id, reaction: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={editedEmotion.description}
          onChange={(e) =>
            setEditedEmotion({
              ...editedEmotion,
              id: editedEmotion._id,
              description: e.target.value,
            })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleEdit}
          className="px-3 py-1 mr-2 text-sm text-green-600 border border-green-600 rounded hover:bg-green-100"
        >
          Save
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 text-sm text-gray-600 border border-gray-600 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 transition-shadow duration-200 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{emotion.name}</h3>
        {emotion.reaction && (
          <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
            {emotion.reaction}
          </span>
        )}
      </div>
      {emotion.description && <p className="mb-4 text-sm text-gray-600">{emotion.description}</p>}

      {isAdmin && (
        <div className="mt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 mr-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(emotion._id)}
            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const AddEmotionForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [reaction, setReaction] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, reaction, description });
    setName('');
    setReaction('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mb-6 bg-white border border-gray-200 rounded-lg">
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Emotion name"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="text"
        name="reaction"
        value={reaction}
        onChange={(e) => setReaction(e.target.value)}
        placeholder="Emotion reaction"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        Add Emotion
      </button>
    </form>
  );
};

const Emotions = () => {
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.user?.isAdmin);
  const queryClient = useQueryClient();

  const {
    data: emotions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['emotions', token],
    queryFn: () => fetchEmotions(token),
  });

  const addEmotionMutation = useMutation({
    mutationFn: addEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotions', token] });
    },
  });

  const deleteEmotionMutation = useMutation({
    mutationFn: deleteEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotions', token] });
    },
  });

  const updateEmotionMutation = useMutation({
    mutationFn: updateEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotions', token] });
    },
  });

  const handleAddEmotion = (newEmotion) => {
    addEmotionMutation.mutate({ token, emotion: newEmotion });
  };

  const handleUpdateEmotion = (id, updatedEmotion) => {
    updateEmotionMutation.mutate({ token, id, emotion: updatedEmotion });
  };

  const handleDeleteEmotion = (id) => {
    if (isAdmin) {
      deleteEmotionMutation.mutate({ token, id });
    } else {
      alert('Only admins can delete emotions.');
    }
  };

  if (isLoading) return <div className="py-10 text-center">Loading emotions...</div>;
  if (error)
    return (
      <div className="py-10 text-center text-red-500">Error loading emotions: {error.message}</div>
    );

  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <Section title="Emotion Management" gridCols={1}>
        <div className="p-4 border-l-4 border-blue-500 rounded-md bg-blue-50">
          <h3 className="mb-2 text-lg font-semibold text-blue-800">What are emotions?</h3>
          <p className="text-blue-700">
            Emotions are complex psychological states that involve three distinct components: a
            subjective experience, a physiological response, and a behavioral or expressive
            response.
          </p>
          <p className="mt-2 text-blue-700">
            Examples of emotions: joy, sadness, anger, fear, surprise, disgust, etc.
          </p>
        </div>

        <AddEmotionForm onAdd={handleAddEmotion} />
        <div className="">
          <p className="text-gray-600">Total emotions: {emotions.length}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {emotions.map((emotion) => (
            <EmotionCard
              key={emotion._id}
              emotion={emotion}
              onDelete={handleDeleteEmotion}
              onEdit={handleUpdateEmotion}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Emotions;
