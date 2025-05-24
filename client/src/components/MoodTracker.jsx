import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MoodTracker = () => {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const moodOptions = ['Happy', 'Sad', 'Anxious', 'Angry', 'Excited', 'Neutral'];

  const fetchMoodHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/moods', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoodHistory(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load mood history');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood) {
      setError('Please select a mood before saving.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/moods',
        { mood, note, date: new Date() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMood('');
      setNote('');
      setSuccessMsg('Mood saved successfully!');
      setError('');
      fetchMoodHistory();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to save mood. Please try again.');
      setSuccessMsg('');
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  return (
    <div className="p-4 border rounded shadow-md bg-white max-w-md mx-auto my-6">
      <h2 className="text-xl font-semibold mb-4">Mood Tracker</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="mood-select" className="block mb-2 font-medium">How are you feeling today?</label>
        <select
          id="mood-select"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required
        >
          <option value="">-- Select Mood --</option>
          {moodOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Add a note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 mb-4 w-full h-24 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Save Mood
        </button>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-3">Mood History</h3>
        {moodHistory.length === 0 && <p className="text-gray-500">No moods logged yet.</p>}
        {moodHistory.map((entry) => (
          <div
            key={entry._id}
            className="mb-4 p-3 border rounded shadow-sm bg-gray-50"
          >
            <p className="font-bold">{entry.mood}</p>
            {entry.note && <p className="text-gray-700 mt-1">{entry.note}</p>}
            <p className="text-sm text-gray-500 mt-1">
              {new Date(entry.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
