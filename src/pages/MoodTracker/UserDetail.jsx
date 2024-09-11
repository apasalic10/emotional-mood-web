import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '../../hooks/useQuery';
import API from '../../axios.js';
import Section from '../../components/Section.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO, startOfWeek, startOfMonth, getWeek, getMonth, getYear } from 'date-fns';
import { Link } from 'react-router-dom';

const fetchUserDetails = async (token, userId) => {
  const response = await API.get(`/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data ?? null;
};

const fetchUserEmotions = async (token, userId) => {
  const response = await API.get(`/api/emotionEntries/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response?.data ?? [];
};

const UserDetail = () => {
  const { userId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.user?.isAdmin);
  const [viewType, setViewType] = useState('daily');
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const [users, setUsers] = useState([]);
  const [displayedEmotions, setDisplayedEmotions] = useState(10);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery(['user', selectedUserId, token], () => fetchUserDetails(token, selectedUserId));

  const {
    data: emotions,
    isLoading: emotionsLoading,
    error: emotionsError,
  } = useQuery(['userEmotions', selectedUserId, token], () =>
    fetchUserEmotions(token, selectedUserId)
  );

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await API.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const loadMoreEmotions = () => {
    setDisplayedEmotions((prevCount) => prevCount + 10);
  };

  if (userLoading || emotionsLoading) return <div className="py-10 text-center">Loading...</div>;
  if (userError || emotionsError)
    return <div className="py-10 text-center text-red-500">Error loading data</div>;
  if (!user) return <div className="py-10 text-center">User not found</div>;

  const processEmotionData = () => {
    if (!emotions || emotions.length === 0) return [];

    const groupData = (getKey, formatLabel) => {
      const groupedData = emotions.reduce((acc, entry) => {
        const key = getKey(parseISO(entry.createdAt));
        if (!acc[key]) {
          acc[key] = { date: key, emotions: {} };
        }
        const emotionName = entry.emotion?.name;
        acc[key].emotions[emotionName] = (acc[key].emotions[emotionName] || 0) + 1;
        return acc;
      }, {});

      return Object.values(groupedData).map((group) => ({
        date: formatLabel(group.date),
        ...group.emotions,
      }));
    };

    switch (viewType) {
      case 'daily':
        return groupData(
          (date) => format(date, 'yyyy-MM-dd'),
          (date) => format(parseISO(date), 'MMM dd')
        );
      case 'weekly':
        return groupData(
          (date) => `${getYear(date)}-W${getWeek(date)}`,
          (date) => `Week ${date.split('-W')[1]}, ${date.split('-')[0]}`
        );
      case 'monthly':
        return groupData(
          (date) => format(date, 'yyyy-MM'),
          (date) => format(parseISO(date), 'MMM yyyy')
        );
      default:
        return [];
    }
  };

  const emotionData = processEmotionData();
  const uniqueEmotions = [...new Set(emotions?.map((e) => e.emotion?.name) || [])];

  const getYAxisDomain = () => {
    const maxTotal = emotionData.reduce((max, entry) => {
      const total = uniqueEmotions.reduce((sum, emotion) => sum + (entry[emotion] || 0), 0);
      return Math.max(max, total);
    }, 0);
    return [0, maxTotal];
  };

  return (
    <div className="min-h-screen py-10 space-y-6 bg-gray-100">
      <Section title="User Details" gridCols={1}>
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {user?.fullname ? user.fullname : `${user.firstname} ${user.lastname}`}
            </h2>
            {user.isAdmin && (
              <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                Admin
              </span>
            )}
          </div>
          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="mb-2">
            <strong>User ID:</strong> {selectedUserId}
          </p>
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link
              to={`/users/${selectedUserId}/edit`}
              className="px-3 py-1 mr-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100"
            >
              Edit User
            </Link>
          </div>
        </div>
      </Section>

      <Section title="Emotion Entry Report" gridCols={1}>
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="mb-4">
            <button
              onClick={() => setViewType('daily')}
              className={`mr-2 px-4 py-2 rounded ${viewType === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewType('weekly')}
              className={`mr-2 px-4 py-2 rounded ${viewType === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-4 py-2 rounded ${viewType === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Monthly View
            </button>
          </div>
          {emotionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={emotionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={getYAxisDomain()} />
                <Tooltip
                  formatter={(value, name, props) => [`Count: ${value}`, `Emotion: ${name}`]}
                />
                <Legend />
                {uniqueEmotions.map((emotion, index) => (
                  <Bar
                    key={emotion}
                    dataKey={emotion}
                    stackId="a"
                    fill={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="py-10 text-center">No emotion data available</div>
          )}
        </div>
      </Section>

      {isAdmin && (
        <Section title="User Emotions" gridCols={1}>
          <div className="p-2 bg-white ">
            {emotions && emotions.length > 0 ? (
              <>
                <ul className="space-y-4">
                  {emotions.slice(0, displayedEmotions).map((entry) => (
                    <li key={entry._id} className="p-4 border border-gray-200 rounded">
                      <p>
                        <strong>Emotion:</strong> {entry.emotion?.name}
                      </p>
                      <p>
                        <strong>Activity:</strong> {entry.activity?.name || 'Not specified'}
                      </p>
                      <p>
                        <strong>Date:</strong>{' '}
                        {format(parseISO(entry.createdAt), 'MMMM d, yyyy h:mm a')}
                      </p>
                      <p>
                        <strong>Description:</strong> {entry.description}
                      </p>
                      {entry.voiceMessage && (
                        <div className="mt-2">
                          <strong>Voice Message:</strong>
                          <audio controls className="w-full mt-1">
                            <source src={`data:audio/wav;base64,${entry.voiceMessage}`} />
                          </audio>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {displayedEmotions < emotions.length && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={loadMoreEmotions}
                      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>No emotion entries found for this user.</p>
            )}
          </div>
        </Section>
      )}
    </div>
  );
};

export default UserDetail;
