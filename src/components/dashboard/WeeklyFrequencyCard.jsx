// components/dashboard/WeeklyFrequencyCard.jsx

/**
 * WeeklyFrequencyCard
 * @param {Array<{ day: string, count: number }>} data - array of 7 days
 */
export default function WeeklyFrequencyCard({ data }) {
  const MAX_BAR_PX = 160;
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h3 className="section-label">Weekly Frequency</h3>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            padding: "0.25rem 0.5rem",
            backgroundColor: "var(--surface-container-highest)",
            borderRadius: "0.25rem",
            color: "#d4d4d4",
          }}
        >
          THIS WEEK
        </span>
      </div>

      <div className="freq-card__bars" role="img" aria-label="Weekly problem-solving frequency chart">
        {data.map((bar) => {
          const heightPx = Math.round((bar.count / maxCount) * MAX_BAR_PX);
          const isActive = bar.active;
          return (
            <div key={bar.day} className="freq-bar">
              <div
                className={`freq-bar__fill${isActive ? " freq-bar__fill--active" : " freq-bar__fill--inactive"}`}
                style={{ height: `${Math.max(heightPx, 8)}px` }}
                title={`${bar.day}: ${bar.count} problems`}
              />
              <span className={`freq-bar__day${isActive ? " freq-bar__day--active" : " freq-bar__day--inactive"}`}>
                {bar.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}