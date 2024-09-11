import API from '../axios.js';

export const fetchUsers = async (token) => {
  const response = await API.get(`/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data ?? [];
};

export const fetchEmotions = async (token) => {
  const response = await API.get(`/api/emotions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data ?? [];
};

export const fetchActivities = async (token) => {
  const response = await API.get(`/api/activities`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data ?? [];
};

export const fetchEmotionEntries = async (token) => {
  const response = await API.get(`/api/emotionEntries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data ?? [];
};

export const fetchEducationMaterials = async (token) => {
  const response = await API.get(`/api/educationMaterials`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data ?? [];
};
