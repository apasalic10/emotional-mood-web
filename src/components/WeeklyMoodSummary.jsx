import React, { useMemo } from 'react';
import { format, subDays } from 'date-fns';
import Section from './Section.jsx';

const WeeklyMoodSummary = ({ emotionEntries }) => {
  const { moodData, emotionSpectrum } = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    // Create a spectrum of emotions based on their average position in daily entries
    const emotionPositions = {};
    const emotionCounts = {};
    emotionEntries.forEach((entry) => {
      const emotion = entry.emotion_id.name;
      const date = entry.createdAt.split('T')[0];
      if (!emotionPositions[emotion]) {
        emotionPositions[emotion] = 0;
        emotionCounts[emotion] = 0;
      }
      emotionPositions[emotion] += emotionEntries
        .filter((e) => e.createdAt.startsWith(date))
        .indexOf(entry);
      emotionCounts[emotion]++;
    });

    const spectrum = Object.keys(emotionPositions).sort(
      (a, b) => emotionPositions[a] / emotionCounts[a] - emotionPositions[b] / emotionCounts[b]
    );

    const moodByDay = days.map((date) => {
      const dayEntries = emotionEntries.filter((entry) => entry.createdAt.startsWith(date));
      if (dayEntries.length === 0) return { date, score: null };

      const moodScore =
        dayEntries.reduce((sum, entry) => {
          const emotionIndex = spectrum.indexOf(entry.emotion_id.name);
          return sum + emotionIndex / (spectrum.length - 1);
        }, 0) / dayEntries.length;

      return { date, score: moodScore };
    });

    return { lastSevenDays: days, moodData: moodByDay, emotionSpectrum: spectrum };
  }, [emotionEntries]);

  const getMoodColor = (score) => {
    if (score === null) return 'bg-gray-200';
    const hue = score * 120; // 0 is red, 120 is green
    return `bg-[hsl(${hue},70%,50%)]`;
  };

  return (
    <Section title="Weekly Mood Summary" gridCols={1}>
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Past Week in Moods</h3>
        <div className="flex items-center justify-between">
          {moodData.map(({ date, score }) => (
            <div key={date} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full ${getMoodColor(score)} mb-2`}
                title={score !== null ? `Mood score: ${score.toFixed(2)}` : 'No data for this day'}
              ></div>
              <span className="text-xs text-gray-600">{format(new Date(date), 'EEE')}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-gray-600">
          <p className="mb-2">
            This summary shows your average daily mood over the past week. Hover over each circle to
            see the mood score.
          </p>
          {emotionSpectrum.length > 0 && (
            <>
              <p>Emotion spectrum (negative to positive):</p>
              <p className="font-medium">{emotionSpectrum.join(' → ')}</p>
            </>
          )}
        </div>
      </div>
    </Section>
  );
};

export default WeeklyMoodSummary;
