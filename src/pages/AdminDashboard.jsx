import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        setError('Failed to fetch admin data');
        console.error(err);
      }
    };

    fetchAdminData();
  }, []);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👑 Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl">{data.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Journal Entries</h2>
          <p className="text-2xl">{data.totalJournals}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Mood Entries</h2>
          <p className="text-2xl">{data.totalMoodEntries}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Top Mood</h2>
          <p className="text-2xl">{data.mostCommonMood}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
