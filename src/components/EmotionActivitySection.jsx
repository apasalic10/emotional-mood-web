import React from 'react';
import Section from './Section.jsx';

const EmotionActivitySection = ({ emotionEntries }) => {
  // Process data for emotion-activity relationship
  const emotionActivityMap = emotionEntries.reduce((acc, entry) => {
    const emotion = entry.emotion_id.name;
    const activity = entry.activity_id.name;
    if (!acc[activity]) acc[activity] = {};
    acc[activity][emotion] = (acc[activity][emotion] || 0) + 1;
    return acc;
  }, {});

  return (
    <Section title="Emotion-Activity Relationship" gridCols={1}>
      <div className="bg-white p-4 rounded-lg shadow">
        {/* Implement your emotion-activity visualization here */}
        {Object.entries(emotionActivityMap).map(([activity, emotions]) => (
          <div key={activity}>
            <h3>{activity}</h3>
            {Object.entries(emotions).map(([emotion, count]) => (
              <div key={emotion}>
                {emotion}: {count}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default EmotionActivitySection;
