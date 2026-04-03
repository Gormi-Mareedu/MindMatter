import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const API_URL = "https://mindmatter-jzke.onrender.com/";

function Dashboard() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [moods, setMoods] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editMood, setEditMood] = useState("");
  const [editNote, setEditNote] = useState("");

  const [journal, setJournal] = useState("");
  const [journals, setJournals] = useState([]);

  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Protect route
  useEffect(() => {
    if (!token) {
      alert("Please login first");
      navigate("/");
    } else {
      fetchMoods();
    }
  }, [token, navigate]);

  // ================= MOODS =================

  const fetchMoods = async () => {
    try {
      const res = await axios.get(`${API_URL}/getMoods`, {
        headers: { Authorization: token },
      });
      setMoods(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addMood = async () => {
    if (!mood.trim()) return alert("Mood cannot be empty");

    try {
      const res = await axios.post(
        `${API_URL}/addMood`,
        { mood, note },
        { headers: { Authorization: token } }
      );

      alert(res.data.message);
      setMood("");
      setNote("");
      fetchMoods();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMood = async (id) => {
    try {
      await axios.delete(`${API_URL}/deleteMood/${id}`, {
        headers: { Authorization: token },
      });
      fetchMoods();
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditMood(item.mood);
    setEditNote(item.note);
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${API_URL}/updateMood/${editingId}`,
        { mood: editMood, note: editNote },
        { headers: { Authorization: token } }
      );
      setEditingId(null);
      fetchMoods();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= JOURNAL =================

  const addJournal = () => {
    if (!journal.trim()) return;

    const newEntry = {
      text: journal,
      date: new Date().toLocaleString(),
    };

    setJournals([newEntry, ...journals]);
    setJournal("");
  };

  // ================= CHARTS =================

  const moodCount = {};
  moods.forEach((m) => {
    moodCount[m.mood] = (moodCount[m.mood] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(moodCount),
    datasets: [{ data: Object.values(moodCount) }],
  };

  const weeklyData = {};
  moods.forEach((m) => {
    const day = new Date(m.date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    weeklyData[day] = (weeklyData[day] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(weeklyData),
    datasets: [
      {
        label: "Moods per day",
        data: Object.values(weeklyData),
      },
    ],
  };

  // ================= HELPERS =================

  const getMoodColor = (mood) => {
    const m = mood.toLowerCase();
    if (m.includes("happy")) return "green";
    if (m.includes("sad")) return "red";
    if (m.includes("angry")) return "orange";
    if (m.includes("calm")) return "blue";
    return "gray";
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ================= UI =================

  return (
    <div className={darkMode ? "container dark" : "container"}>
      
      {/* HEADER */}
      <div className="card" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>MindMatter Dashboard</h2>
        <div>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light" : "Dark"}
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* ADD MOOD */}
      <div className="card">
        <h3>Add Mood</h3>
        <input
          placeholder="Mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={addMood}>Add</button>
      </div>

      {/* JOURNAL */}
      <div className="card">
        <h3>Journal</h3>
        <textarea
          placeholder="Write your thoughts..."
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        />
        <button onClick={addJournal}>Save Entry</button>

        {journals.map((j, index) => (
          <div key={index}>
            <p>{j.text}</p>
            <small>{j.date}</small>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="card">
        <h3>Mood Distribution</h3>
        {moods.length > 0 ? <Pie data={chartData} /> : <p>No data</p>}
      </div>

      <div className="card">
        <h3>Weekly Trend</h3>
        <Bar data={barData} />
      </div>

      {/* MOODS */}
      <h3>Your Moods</h3>

      {moods.map((item) => (
        <div className="card" key={item._id}>
          {editingId === item._id ? (
            <>
              <input value={editMood} onChange={(e) => setEditMood(e.target.value)} />
              <input value={editNote} onChange={(e) => setEditNote(e.target.value)} />
              <button onClick={saveEdit}>Save</button>
            </>
          ) : (
            <>
              <p>
                <strong style={{ color: getMoodColor(item.mood) }}>
                  {item.mood}
                </strong>
              </p>
              <p>{item.note}</p>
              <small>{new Date(item.date).toLocaleString()}</small>

              <div>
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => deleteMood(item._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;