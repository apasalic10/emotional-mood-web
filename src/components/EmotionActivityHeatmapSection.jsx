import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
} from 'recharts';
import Section from './Section.jsx';

const EmotionActivityHeatmapSection = ({ emotionEntries }) => {
  const processData = (entries) => {
    const data = [];
    const activitySet = new Set();
    const emotionSet = new Set();

    entries.forEach((entry) => {
      const activity = entry.activity_id?.name || 'Unknown activity';
      const emotion = entry.emotion_id?.name || 'Unknown emotion';

      activitySet.add(activity);
      emotionSet.add(emotion);

      const existingDataPoint = data.find((d) => d.activity === activity && d.emotion === emotion);
      if (existingDataPoint) {
        existingDataPoint.value += 1;
      } else {
        data.push({ activity, emotion, value: 1 });
      }
    });

    const activities = Array.from(activitySet).sort();
    const emotions = Array.from(emotionSet).sort();

    return { data, activities, emotions };
  };

  const { data, activities, emotions } = processData(emotionEntries);

  const maxValue = Math.max(...data.map((d) => d.value));

  const getColor = (value) => {
    const intensity = value / maxValue;
    return `rgb(255, ${Math.round(255 * (1 - intensity))}, ${Math.round(255 * (1 - intensity))})`;
  };

  // Function to add jitter to X and Y indexes
  const addJitterToDataPoints = (data, jitterAmount = 0.2) => {
    return data.map((item) => ({
      ...item,
      activityIndex:
        activities.indexOf(item.activity) + (Math.random() * jitterAmount - jitterAmount / 2),
      emotionIndex:
        emotions.indexOf(item.emotion) + (Math.random() * jitterAmount - jitterAmount / 2),
    }));
  };

  const jitteredData = addJitterToDataPoints(data);

  return (
    <Section title="Correlation Between Emotions and Activities" gridCols={1}>
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <p className="mb-4 text-sm text-gray-600">
          This heatmap visualizes the frequency of emotions experienced during different activities.
          Darker colors indicate a higher occurrence of an emotion for a particular activity,
          helping identify patterns and potential mood triggers.
        </p>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
              <XAxis
                type="number"
                dataKey="activityIndex"
                name="Activity"
                tickCount={activities.length}
                domain={[0, activities.length - 1]}
                interval={0}
                tickFormatter={(index) => activities[Math.round(index)] || ''}
              />
              <YAxis
                type="number"
                dataKey="emotionIndex"
                name="Emotion"
                tickCount={emotions.length}
                domain={[0, emotions.length - 1]}
                interval={0}
                tickFormatter={(index) => emotions[Math.round(index)] || ''}
              />
              <ZAxis type="number" dataKey="value" range={[0, 1000]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const { activity, emotion, value } = payload[0].payload;
                    return (
                      <div className="p-2 bg-white border border-gray-200 rounded shadow">
                        <p className="font-semibold">{`${emotion} during ${activity}`}</p>
                        <p>{`Frequency: ${value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={jitteredData}>
                {jitteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">Less frequent</span>
          <div className="w-1/2 h-2 rounded bg-gradient-to-r from-white to-red-500"></div>
          <span className="text-xs text-gray-500">More frequent</span>
        </div>
      </div>
    </Section>
  );
};

export default EmotionActivityHeatmapSection;
