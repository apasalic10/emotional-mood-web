import { useQuery } from './useQuery';
import {
  fetchUsers,
  fetchEmotions,
  fetchActivities,
  fetchEmotionEntries,
  fetchEducationMaterials,
} from '../api/moodTrackerApi.js';

export const useDataFetching = (token) => {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery(['users', token], () => fetchUsers(token));
  const {
    data: emotions,
    isLoading: emotionsLoading,
    error: emotionsError,
  } = useQuery(['emotions', token], () => fetchEmotions(token));
  const {
    data: activities,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useQuery(['activities', token], () => fetchActivities(token));
  const {
    data: emotionEntries,
    isLoading: emotionEntriesLoading,
    error: emotionEntriesError,
  } = useQuery(['emotionEntries', token], () => fetchEmotionEntries(token));
  const {
    data: educationMaterials,
    isLoading: educationMaterialsLoading,
    error: educationMaterialsError,
  } = useQuery(['educationMaterials', token], () => fetchEducationMaterials(token));

  const isLoading =
    usersLoading ||
    emotionsLoading ||
    activitiesLoading ||
    emotionEntriesLoading ||
    educationMaterialsLoading;
  const error =
    usersError ||
    emotionsError ||
    activitiesError ||
    emotionEntriesError ||
    educationMaterialsError;

  return {
    users,
    emotions,
    activities,
    emotionEntries,
    educationMaterials,
    isLoading,
    error,
  };
};
