const axios = require('axios');

const API_URL = "https://mindmatter-jzke.onrender.com";

async function test() {
  try {
    // 1. Register
    const email = `test_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/register`, {
      name: "Test User",
      email,
      password: "password123"
    });
    console.log("Registered");

    // 2. Login
    const loginRes = await axios.post(`${API_URL}/login`, {
      email,
      password: "password123"
    });
    const token = loginRes.data.token;
    console.log("Logged in, token:", token.substring(0, 10) + "...");

    // 3. Add Mood
    const addMoodRes = await axios.post(`${API_URL}/addMood`, {
      mood: "happy",
      energy: "high",
      intensity: 3,
      note: "Test note"
    }, {
      headers: { Authorization: token }
    });
    console.log("Add mood success:", addMoodRes.data);

  } catch (err) {
    console.error("Error:");
    if (err.response) {
      console.error(err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

test();
