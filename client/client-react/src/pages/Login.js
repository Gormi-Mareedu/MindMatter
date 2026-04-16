import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "https://mindmatter-jzke.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Enter all fields");
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (res.data.token) {
        // ✅ FIX: unified token handling
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("token", res.data.token);

        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          className="border p-2 w-full mb-2 rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-2">
          <input
            className="border p-2 w-full rounded"
            type={showPass ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-2 cursor-pointer text-sm text-gray-600"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "Hide" : "Show"}
          </span>
        </div>

        <div className="flex items-center mb-2">
          <input type="checkbox" onChange={() => setRemember(!remember)} />
          <span className="ml-2 text-sm">Remember me</span>
        </div>

        <button
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-3 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;