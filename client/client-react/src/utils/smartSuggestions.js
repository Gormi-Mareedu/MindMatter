export const getSuggestion = (mood, energy, intensity) => {

  if (mood === "anxious" && intensity >= 4) {
    return "Try deep breathing: inhale 4s, hold 7s, exhale 8s.";
  }

  if (mood === "sad" && energy === "low") {
    return "Go for a short walk or listen to uplifting music.";
  }

  if (mood === "angry") {
    return "Pause. Step away. Avoid reacting immediately.";
  }

  if (mood === "happy") {
    return "Great! Capture this moment in your journal.";
  }

  return "Stay mindful and check in with yourself.";
};