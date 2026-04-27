import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        width: "100%",
        maxWidth: "600px",
        overflow: "hidden",
        textAlign: "center",
        padding: "50px 30px"
      }}>
        <h1 style={{ margin: "0 0 10px", fontSize: "40px", fontWeight: 800, color: "#2d3748" }}>
          🧠 MindMatter
        </h1>
        <p style={{ margin: "0 0 40px", fontSize: "18px", color: "#718096", lineHeight: "1.6" }}>
          Your personal mental wellness companion. Track your mood, manage stress, and find peace of mind everyday.
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "15px 40px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 15px 25px rgba(102, 126, 234, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(102, 126, 234, 0.3)";
            }}
            >
              Get Started
            </button>
          </Link>

          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "15px 40px",
              background: "white",
              color: "#667eea",
              border: "2px solid #667eea",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.background = "#f8f9fa";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(102, 126, 234, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "white";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
