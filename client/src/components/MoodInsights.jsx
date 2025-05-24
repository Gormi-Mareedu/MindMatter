import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MoodInsights = () => {
  const [moodData, setMoodData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/moods/insights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMoodData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load mood insights');
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="mt-10 p-4 border rounded shadow bg-white">
      <h2 className="text-2xl font-semibold mb-4">📊 Mood Insights</h2>
      {error && <p className="text-red-500">{error}</p>}

      {moodData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" label={{ value: 'Mood', position: 'insideBottom', dy: 10 }} />
            <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-600">No mood data available yet. Start tracking your moods!</p>
      )}
    </div>
  );
};

export default MoodInsights;
