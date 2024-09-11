import React from 'react';
import { useSelector } from 'react-redux';
import { useDataFetching } from '../../hooks/useDataFetching';
import OverviewSection from '../../components/OverviewSection';
import EmotionDistributionSection from '../../components/EmotionDistributionSection';
import EmotionActivityHeatmapSection from '../../components/EmotionActivityHeatmapSection';
import EmotionTrendChart from '../../components/EmotionTrendChart';

const Home = () => {
  const token = useSelector((state) => state.auth.token);
  const { users, emotions, activities, emotionEntries, educationMaterials, isLoading, error } =
    useDataFetching(token);

  if (isLoading) {
    return <div className="py-10 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="py-10 text-center text-re66d8c3ebfaa7242ff069f718d-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 space-y-6 bg-gray-100">
      <OverviewSection
        users={users}
        emotions={emotions}
        activities={activities}
        educationMaterials={educationMaterials}
      />

      <EmotionDistributionSection emotions={emotions} emotionEntries={emotionEntries} />

      <EmotionActivityHeatmapSection emotionEntries={emotionEntries} />

      <EmotionTrendChart emotionEntries={emotionEntries} />
    </div>
  );
};

export default Home;
