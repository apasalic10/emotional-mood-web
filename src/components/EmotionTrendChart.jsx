import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import Section from './Section.jsx';

const EmotionTrendChart = ({ emotionEntries }) => {
  const processData = () => {
    const sortedEntries = emotionEntries.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const uniqueEmotions = [
      ...new Set(sortedEntries.map((entry) => entry.emotion_id?.name).filter(Boolean)),
    ];

    const data = sortedEntries.reduce((acc, entry) => {
      if (!entry.emotion_id?.name) return acc;
      const date = new Date(entry.createdAt).toLocaleDateString();
      const existingEntry = acc.find((item) => item.date === date);
      if (existingEntry) {
        existingEntry[entry.emotion_id.name] = (existingEntry[entry.emotion_id.name] || 0) + 1;
      } else {
        const newEntry = { date };
        uniqueEmotions.forEach((emotion) => {
          newEntry[emotion] = emotion === entry.emotion_id.name ? 1 : 0;
        });
        acc.push(newEntry);
      }
      return acc;
    }, []);

    return { data, uniqueEmotions };
  };

  const { data, uniqueEmotions } = processData();
  const colors = generateColorMap(uniqueEmotions);

  const renderChart = () => {
    if (data.length === 0) {
      return <p className="text-center text-gray-600">No data available to display.</p>;
    }

    if (data.length === 1) {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="category" dataKey="date" name="Date" />
            <YAxis type="number" name="Count" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {uniqueEmotions.map((emotion) => (
              <Scatter key={emotion} name={emotion} data={[data[0]]} fill={colors[emotion]} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {uniqueEmotions.map((emotion) => (
            <Line
              key={emotion}
              type="monotone"
              dataKey={emotion}
              stroke={colors[emotion]}
              activeDot={{ r: 8 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Section title="Emotional Trends Over Time" gridCols={1}>
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <p className="mb-4 text-sm text-gray-600">
          This chart shows how the frequency of different emotions has changed over time. Each line
          represents a different emotion, and the height of the line indicates the number of times
          that emotion was recorded on a given day. This can help you identify patterns in emotional
          experiences and track your clients' emotional journeys over time.
        </p>
        {renderChart()}
      </div>
    </Section>
  );
};

// Function to generate a color based on a string (emotion name)
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

// Function to generate a color map for all emotions
const generateColorMap = (emotions) => {
  const colorMap = {};
  emotions.forEach((emotion) => {
    colorMap[emotion] = stringToColor(emotion);
  });
  return colorMap;
};

export default EmotionTrendChart;
