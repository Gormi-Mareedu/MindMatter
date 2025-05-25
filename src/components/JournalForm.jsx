import React, { useState } from 'react';
import axios from 'axios';

const JournalForm = ({ onJournalCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/journals',
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle('');
      setContent('');
      onJournalCreated(); // Notify parent to refresh list
    } catch (err) {
      setError('Failed to create journal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Journal</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border p-2 mb-4 w-full"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="border p-2 mb-4 w-full h-28"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Saving...' : 'Save Journal'}
      </button>
    </form>
  );
};

export default JournalForm;
