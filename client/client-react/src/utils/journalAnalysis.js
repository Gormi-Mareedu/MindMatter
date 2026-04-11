export const analyzeJournal = (text) => {
  const lower = text.toLowerCase();

  let score = 0;

  const negativeWords = ["sad", "depressed", "tired", "angry", "anxious", "stress"];
  const positiveWords = ["happy", "grateful", "excited", "calm", "productive"];

  negativeWords.forEach(word => {
    if (lower.includes(word)) score--;
  });

  positiveWords.forEach(word => {
    if (lower.includes(word)) score++;
  });

  let mood = "neutral";
  if (score > 0) mood = "positive";
  if (score < 0) mood = "negative";

  return {
    score,
    mood
  };
};