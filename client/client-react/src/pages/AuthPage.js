import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "https://mindmatter-jzke.onrender.com";

function AuthPage() {
  const [tab, setTab] = useState("login"); // "login" or "register"
  const navigate = useNavigate();

  // ─── Login state ───
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // ─── Register state ───
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // ─── Login handler ───
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return toast.error("Enter all fields");

    try {
      setLoginLoading(true);
      const res = await axios.post(`${API_URL}/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      if (res.data.token) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("token", res.data.token);
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch {
      toast.error("Invalid credentials. If first attempt, server may be waking up — try again in 30s.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ─── Register handler ───
  const handleRegister = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !regEmail || !regPassword) return toast.error("All fields required");
    if (!emailRegex.test(regEmail)) return toast.error("Invalid email");
    if (regPassword.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      setRegLoading(true);
      await axios.post(`${API_URL}/register`, {
        name,
        email: regEmail,
        password: regPassword,
      });
      toast.success("Registered! Please log in.");
      setTab("login");
      setName(""); setRegEmail(""); setRegPassword("");
    } catch {
      toast.error("Registration failed. Email might already be in use.");
    } finally {
      setRegLoading(false);
    }
  };

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
        maxWidth: "420px",
        overflow: "hidden"
      }}>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "30px 30px 20px",
          textAlign: "center",
          color: "white"
        }}>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 700 }}>🧠 MindMatter</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.85, fontSize: "14px" }}>Your mental wellness companion</p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderBottom: "2px solid #f0f0f0" }}>
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "14px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "15px",
                color: tab === t ? "#667eea" : "#999",
                borderBottom: tab === t ? "3px solid #667eea" : "3px solid transparent",
                marginBottom: "-2px",
                transition: "all 0.2s ease"
              }}
            >
              {t === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div style={{ padding: "30px" }}>

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showLoginPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={inputStyle}
                  />
                  <span
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    style={{
                      position: "absolute", right: "12px", top: "50%",
                      transform: "translateY(-50%)", cursor: "pointer",
                      fontSize: "13px", color: "#667eea", fontWeight: 600
                    }}
                  >
                    {showLoginPass ? "Hide" : "Show"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="remember" style={{ fontSize: "14px", color: "#555", cursor: "pointer" }}>
                  Remember me
                </label>
              </div>

              <button type="submit" disabled={loginLoading} style={btnStyle(loginLoading)}>
                {loginLoading ? "Logging in... (server may be waking up)" : "Login"}
              </button>

              <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#777" }}>
                Don't have an account?{" "}
                <span
                  onClick={() => setTab("register")}
                  style={{ color: "#667eea", cursor: "pointer", fontWeight: 600 }}
                >
                  Register
                </span>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === "register" && (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showRegPass ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={inputStyle}
                  />
                  <span
                    onClick={() => setShowRegPass(!showRegPass)}
                    style={{
                      position: "absolute", right: "12px", top: "50%",
                      transform: "translateY(-50%)", cursor: "pointer",
                      fontSize: "13px", color: "#667eea", fontWeight: 600
                    }}
                  >
                    {showRegPass ? "Hide" : "Show"}
                  </span>
                </div>
              </div>

              <button type="submit" disabled={regLoading} style={btnStyle(regLoading)}>
                {regLoading ? "Creating account..." : "Create Account"}
              </button>

              <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#777" }}>
                Already have an account?{" "}
                <span
                  onClick={() => setTab("login")}
                  style={{ color: "#667eea", cursor: "pointer", fontWeight: 600 }}
                >
                  Login
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared styles ───
const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#444"
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "2px solid #e8e8e8",
  borderRadius: "10px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease"
};

const btnStyle = (loading) => ({
  width: "100%",
  padding: "13px",
  background: loading
    ? "#a0aec0"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: loading ? "not-allowed" : "pointer",
  transition: "opacity 0.2s ease"
});

export default AuthPage;
