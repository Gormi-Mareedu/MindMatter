import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JournalList from './components/JournalList';
import JournalForm from './components/JournalForm';
import Login from './components/Login';
import Register from './components/Register';
import MoodTracker from './components/MoodTracker';
import Resources from './components/Resources';
import MoodInsights from './components/MoodInsights';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute'; // <-- import here

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [refreshJournals, setRefreshJournals] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() >= exp * 1000) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const refreshJournalList = () => {
    setRefreshJournals((prev) => !prev);
  };

  return (
    <Router>
      <main className="max-w-3xl mx-auto p-4 font-sans">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold" tabIndex="0">
            MindMatter
          </h1>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 text-white px-4 py-2 rounded"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
        </header>

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <section aria-live="polite">
                  <JournalForm onJournalCreated={refreshJournalList} />
                  <JournalList key={refreshJournals} refreshTrigger={refreshJournals} />
                  <MoodTracker />
                  <MoodInsights />
                  <Resources />
                </section>
              ) : showRegister ? (
                <>
                  <Register onRegister={() => setIsLoggedIn(true)} />
                  <p className="mt-4 text-center">
                    Already have an account?{' '}
                    <button
                      onClick={() => setShowRegister(false)}
                      className="text-blue-600 underline focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      Login
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <Login onLogin={() => setIsLoggedIn(true)} />
                  <p className="mt-4 text-center">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setShowRegister(true)}
                      className="text-blue-600 underline focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      Register
                    </button>
                  </p>
                </>
              )
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
