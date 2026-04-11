import CalendarHeatmap from "react-calendar-heatmap";

<CalendarHeatmap
  values={moods.map(m => ({
    date: m.createdAt,
    count: 1
  }))}
/>