export const getInsight = (moods) => {
    if (moods.length === 0) return "No data yet";

    const negative = moods.filter(m =>
        ["sad", "angry", "anxious"].includes(m.mood)
    ).length;

    if (negative > moods.length / 2) {
        return "⚠️ You’ve been feeling low recently. Consider taking a break or talking to someone.";
    }

    return "✅ Your mood looks stable. Keep it up!";
};