// components/dashboard/ProblemDistributionCard.jsx
import Icon from "../Icon";

const DIFFICULTY_COLORS = {
  Easy:   "#10b981",
  Medium: "var(--primary-container)",
  Hard:   "#ef4444",
};

/**
 * ProblemDistributionCard
 * @param {number} totalSolved  - e.g. 412
 * @param {number} totalProbs   - total available problems (used for ring %)
 * @param {{ Easy: number, Medium: number, Hard: number }} breakdown
 */
export default function ProblemDistributionCard({
  totalSolved = 412,
  totalProbs = 550,
  breakdown = { Easy: 132, Medium: 245, Hard: 35 },
}) {
  const RADIUS = 70;
  const STROKE = 12;
  const circumference = 2 * Math.PI * RADIUS;
  const fillRatio = Math.min(totalSolved / totalProbs, 1);
  const offset = circumference * (1 - fillRatio);

  return (
    <div className="card dist-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h3 className="section-label">Problem Distribution</h3>
        <Icon name="more_horiz" style={{ color: "#525252" }} />
      </div>

      <div className="dist-card__body">
        {/* Ring */}
        <div className="dist-ring" aria-label={`${totalSolved} problems solved`}>
          <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            <circle
              cx="80" cy="80" r={RADIUS}
              fill="transparent"
              stroke="var(--surface-container-highest)"
              strokeWidth={STROKE}
            />
            <circle
              cx="80" cy="80" r={RADIUS}
              fill="transparent"
              stroke="var(--primary)"
              strokeWidth={STROKE}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="dist-ring__center">
            <span className="dist-ring__count">{totalSolved}</span>
            <span className="dist-ring__label">Solved</span>
          </div>
        </div>

        {/* Legend */}
        <dl className="dist-legend">
          {Object.entries(breakdown).map(([level, count]) => (
            <div key={level} className="dist-legend__item">
              <div className="dist-legend__dot-label">
                <div className="dist-legend__dot" style={{ backgroundColor: DIFFICULTY_COLORS[level] }} />
                <dt className="dist-legend__name">{level}</dt>
              </div>
              <dd className="dist-legend__count">{count}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}