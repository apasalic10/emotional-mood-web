import React, { useMemo } from 'react';
import Section from './Section.jsx';

const EmotionDistributionSection = ({ emotions, emotionEntries }) => {
  // Process data for emotion distribution
  const { sortedEmotions, maxCount, colorMap } = useMemo(() => {
    const counts = emotionEntries.reduce((acc, entry) => {
      if (!entry.emotion_id?.name) return acc;
      const emotion = entry.emotion_id?.name;
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});

    const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const max = Math.max(...Object.values(counts));
    const colors = generateColorMap(Object.keys(counts));

    return { emotionCounts: counts, sortedEmotions: sorted, maxCount: max, colorMap: colors };
  }, [emotionEntries]);

  return (
    <Section title="Emotion Distribution" gridCols={1}>
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Emotions</h3>
            <div className="space-y-2">
              {sortedEmotions.map(([emotion]) => (
                <div key={emotion} className="flex items-center">
                  <div
                    className="w-3 h-3 mr-2 rounded-full"
                    style={{ backgroundColor: colorMap[emotion] }}
                  ></div>
                  <span className="text-sm text-gray-600">{emotion}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Frequency</h3>
            <div className="space-y-2">
              {sortedEmotions.map(([emotion, count]) => (
                <div key={emotion} className="flex items-center">
                  <div className="flex-grow">
                    <div className="h-6 overflow-hidden bg-gray-200 rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                          backgroundColor: colorMap[emotion],
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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

export default EmotionDistributionSection;
