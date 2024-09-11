import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Section from './Section.jsx';

const EmotionBarChartSection = ({ emotionEntries }) => {
  const data = emotionEntries.reduce((acc, entry) => {
    const emotion = entry.emotion_id.name;
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <Section title="Emotion Frequency" gridCols={1}>
      <div className="p-4 bg-white rounded-lg shadow h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Section>
  );
};

export default EmotionBarChartSection;
