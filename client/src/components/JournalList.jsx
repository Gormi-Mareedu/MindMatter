import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JournalList = ({ refreshTrigger }) => {
  const [journals, setJournals] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://mindmatter-backend.onrender.com/api/journals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJournals(res.data);
      } catch (err) {
        setError('Failed to fetch journals');
        console.error(err);
      }
    };

    fetchJournals();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://mindmatter-backend.onrender.com/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJournals(journals.filter((j) => j._id !== id));
    } catch (err) {
      setError('Failed to delete journal');
      console.error(err);
    }
  };

  const startEdit = (journal) => {
    setEditingId(journal._id);
    setEditTitle(journal.title);
    setEditContent(journal.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `https://mindmatter-backend.onrender.com/api/journals/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setJournals(journals.map(j => (j._id === id ? res.data : j)));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update journal');
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Journals</h2>
      {error && <p className="text-red-500">{error}</p>}

      {journals.map((journal) =>
        editingId === journal._id ? (
          <div key={journal._id} className="mb-4 p-4 border rounded-lg shadow">
            <input
              className="border p-2 mb-2 w-full"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="border p-2 mb-2 w-full h-24"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <button
              onClick={() => saveEdit(journal._id)}
              className="bg-green-600 text-white px-3 py-1 mr-2 rounded"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div
            key={journal._id}
            className="mb-4 p-4 border rounded-lg shadow flex flex-col"
          >
            <h3 className="text-lg font-bold">{journal.title}</h3>
            <p>{journal.content}</p>
            <p className="text-sm text-gray-500 mb-2">
              Created: {new Date(journal.date).toLocaleString()}
            </p>
            <div>
              <button
                onClick={() => startEdit(journal)}
                className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(journal._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default JournalList;
