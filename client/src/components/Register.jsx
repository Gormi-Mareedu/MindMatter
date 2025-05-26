import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('https://mindmatter-backend.onrender.com/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      onRegister();
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-2xl mb-4 text-center font-semibold">Register</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <label htmlFor="name" className="block mb-1 font-medium">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        value={name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded mb-4"
        placeholder="Your full name"
      />

      <label htmlFor="email" className="block mb-1 font-medium">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded mb-4"
        placeholder="you@example.com"
      />

      <label htmlFor="password" className="block mb-1 font-medium">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={handleChange}
        required
        minLength={6}
        className="w-full p-2 border rounded mb-4"
        placeholder="At least 6 characters"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default Register;
