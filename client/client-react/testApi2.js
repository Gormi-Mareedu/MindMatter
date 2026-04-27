const axios = require('axios');

const API_URL = "https://mindmatter-jzke.onrender.com";

async function test() {
  try {
    const email = `test2_${Date.now()}@test.com`;
    await axios.post(`${API_URL}/register`, {
      name: "Test User",
      email,
      password: "password123"
    });
    
    const loginRes = await axios.post(`${API_URL}/login`, {
      email,
      password: "password123"
    });
    const token = loginRes.data.token;

    // Add Mood with intensity as string
    const addMoodRes = await axios.post(`${API_URL}/addMood`, {
      mood: "happy",
      energy: "high",
      intensity: "3", // STRING!
      note: "Test note"
    }, {
      headers: { Authorization: token }
    });
    console.log("Add mood success with string intensity:", addMoodRes.data);

    // Test with empty note
    const addMoodRes2 = await axios.post(`${API_URL}/addMood`, {
      mood: "happy",
      energy: "high",
      intensity: 3, 
      note: "" // EMPTY NOTE
    }, {
      headers: { Authorization: token }
    });
    console.log("Add mood success with empty note:", addMoodRes2.data);
    
    // Test with empty note AND string intensity
    const addMoodRes3 = await axios.post(`${API_URL}/addMood`, {
      mood: "sad",
      energy: "low",
      intensity: "4", 
      note: "" // EMPTY NOTE
    }, {
      headers: { Authorization: token }
    });
    console.log("Add mood success with empty note and string intensity:", addMoodRes3.data);

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
