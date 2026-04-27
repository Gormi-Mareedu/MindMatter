import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Line } from "react-chartjs-2";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const API_URL = "https://mindmatter-jzke.onrender.com";

function Dashboard() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [energy, setEnergy] = useState("high");
  const [intensity, setIntensity] = useState(3);

  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);

  const [streak, setStreak] = useState(0);
  const [risk, setRisk] = useState(null);

  const [journal, setJournal] = useState("");
  const [report, setReport] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [correlation, setCorrelation] = useState("");
  const navigate = useNavigate();
  const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

  // ================= FETCH =================
  const fetchAll = useCallback(async () => {
    try {
      const headers = { Authorization: token };

      const [moodRes, journalRes, streakRes, riskRes] = await Promise.all([
        axios.get(`${API_URL}/getMoods`, { headers }),
        axios.get(`${API_URL}/getJournals`, { headers }),
        axios.get(`${API_URL}/streak`, { headers }),
        axios.get(`${API_URL}/risk`, { headers }),
      ]);
      const reportRes = await axios.get(`${API_URL}/weeklyReport`, { headers });
      const predRes = await axios.get(`${API_URL}/predictMood`, { headers });
      const [recRes, corrRes] = await Promise.all([
      axios.get(`${API_URL}/recommend`, { headers }),
      axios.get(`${API_URL}/correlation`, { headers }),
      ]);

      setRecommendation(recRes.data.tip);
      setCorrelation(corrRes.data.message);
      setPrediction(predRes.data.prediction);
      setReport(reportRes.data);
      setMoods(moodRes.data);
      setJournals(journalRes.data);
      setStreak(streakRes.data.streak);
      setRisk(riskRes.data);

    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchAll();
  }, [fetchAll, navigate, token]);

  // ================= ADD MOOD =================
  const addMood = async () => {
    if (!mood) return toast.error("Select mood");

    try {
      await axios.post(
        `${API_URL}/addMood`,
        { mood, energy, intensity: Number(intensity) || 3, note },
        { headers: { Authorization: token } }
      );

      toast.success("Mood saved");
      setMood("");
      setNote("");
      setIntensity(3);

      fetchAll();
    } catch (err) {
      console.error("Error saving mood:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error saving mood");
    }
  };

  // ================= ADD JOURNAL =================
  const addJournal = async () => {
    if (!journal) return;

    try {
      const res = await axios.post(
        `${API_URL}/addJournal`,
        { text: journal },
        { headers: { Authorization: token } }
      );

      toast.success(`Saved (Mood: ${res.data.sentiment})`);
      setJournal("");

      fetchAll();
    } catch {
      toast.error("Error saving journal");
    }
  };

  // ================= CHART =================
  const moodCount = {};
  moods.forEach(m => {
    moodCount[m.mood] = (moodCount[m.mood] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(moodCount),
    datasets: [{ data: Object.values(moodCount) }],
  };
  const moodScore = {
  happy: 5,
  calm: 4,
  neutral: 3,
  sad: 2,
  anxious: 1,
  angry: 1
};

const trendData = moods.slice(0, 7).reverse();

const lineData = {
  labels: trendData.map(m =>
    new Date(m.createdAt).toLocaleDateString()
  ),
  datasets: [
    {
      label: "Mood Trend",
      data: trendData.map(m => moodScore[m.mood] || 3),
    },
  ],
};
const heatmapData = moods.map(m => ({
  date: new Date(m.createdAt).toISOString().slice(0, 10),
  count: 1
}));
  // ================= UI =================
  return (
  <div className="bg-gray-100 min-h-screen p-6">

    <ToastContainer />

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">MindMatter Dashboard</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>

    {/* TOP STATS */}
    <div className="grid md:grid-cols-4 gap-4 mb-6">
      
      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="text-gray-500">🔥 Streak</h4>
        <p className="text-2xl font-bold">{streak} days</p>
      </div>

      <div className={`p-4 rounded-xl shadow ${risk?.risk ? "bg-red-200" : "bg-green-200"}`}>
        <h4 className="text-gray-600">⚠️ Risk</h4>
        <p>{risk?.message || "Safe"}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="text-gray-500"> Weekly Improvement</h4>
        <p className={report?.improvement > 0 ? "text-green-500" : "text-red-500"}>
          {report?.improvement || 0}%
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="text-gray-500">🔮 Prediction</h4>
        <p>{prediction}</p>
      </div>

    </div>

    {/* ADD MOOD */}
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <h2 className="font-semibold mb-3">Add Mood</h2>

      <div className="grid md:grid-cols-2 gap-3">
        <select className="border p-2 rounded"
          value={mood}
          onChange={(e) => setMood(e.target.value)}>
          <option value="">Select Mood</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="anxious">Anxious</option>
          <option value="angry">Angry</option>
          <option value="calm">Calm</option>
        </select>

        <select className="border p-2 rounded"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}>
          <option value="high">High Energy</option>
          <option value="low">Low Energy</option>
        </select>

        <input
          type="number"
          min="1"
          max="5"
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={addMood}
        className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Mood
      </button>
    </div>

    {/* CHARTS */}
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="mb-2 font-semibold">Mood Distribution</h3>
        <Pie data={chartData} />
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="mb-2 font-semibold">Mood Trend</h3>
        <Line data={lineData} />
      </div>
    </div>
        {/* 🔥 RECOMMENDATION + CORRELATION */}
<div className="grid md:grid-cols-2 gap-6 mb-6">

  <div className="bg-white p-4 rounded-xl shadow">
    <h3 className="font-semibold mb-2">💡 Recommendation</h3>
    <p>{recommendation}</p>
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    <h3 className="font-semibold mb-2"> Habit Insight</h3>
    <p>{correlation}</p>
  </div>

</div>
{/* 🔥 HEATMAP */}
<div className="bg-white p-4 rounded-xl shadow mb-6">
  <h3 className="font-semibold mb-3">🔥 Activity Heatmap</h3>

  <CalendarHeatmap
    startDate={new Date(new Date().setDate(new Date().getDate() - 30))}
    endDate={new Date()}
    values={heatmapData}
  />
</div>
    {/* JOURNAL */}
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h3 className="mb-2 font-semibold">Journal</h3>

      <textarea
        className="border p-2 w-full mb-2 rounded"
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
      />

      <button
        onClick={addJournal}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Save Entry
      </button>

      {journals.map((j, i) => (
        <div key={i} className="mt-3 border-t pt-2">
          <p>{j.text}</p>
          <small className="text-gray-500">
            Mood detected: {j.sentiment}
          </small>
        </div>
      ))}
    </div>

  </div>
);
}

export default Dashboard;