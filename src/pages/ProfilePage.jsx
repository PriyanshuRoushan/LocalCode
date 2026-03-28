// pages/ProfilePage.jsx
import { useState } from "react";
import "../styles/global.css";
import "../styles/profile-submissions.css";

import Sidebar from "../components/Sidebar";
import TopBar  from "../components/TopBar";
import Icon    from "../components/Icon";

const USER = {
  name: "Alex Chen",
  handle: "@alex_codes_24",
  level: 48,
  tags: ["Algorithms Specialist", "Distributed Systems"],
avatar: "/avatar.jpeg",
};

const STATS = [
  { label: "Total Solved", value: "1,428", meta: "+12 this week", metaClass: "stat-card__meta--gold", gold: true, icon: "task_alt" },
  { label: "Global Rank",  value: "#1,240", meta: "Top 0.8% worldwide", metaClass: "stat-card__meta--muted" },
  { label: "Success Rate", value: "94.2%", bar: 94.2 },
  { label: "Coding Streak", value: "365 Days", meta: "Perfect Year Milestone Reached", metaClass: "stat-card__meta--muted", gold: true, valueCls: "text-primary-container" },
];

const BADGES = [
  { icon: "workspace_premium", name: "Problem Crusher", tier: "Gold Tier" },
  { icon: "bolt",              name: "Algorithm Ace",   tier: "Diamond Tier" },
  { icon: "calendar_today",    name: "Consistent Coder",tier: "Legendary" },
];

const MILESTONES = [
  { active: true,  date: "Yesterday",    dotIcon: "check",       title: "Solved 1,400th problem (Median of Two Sorted Arrays)", sub: 'Unlocked "Heavy Lifter" achievement badge' },
  { active: false, date: "3 days ago",   dotIcon: "trending_up", title: "Reached Level 48",                                     sub: "Gained +2000 XP from weekly contest performance" },
  { active: false, date: "1 week ago",   dotIcon: "military_tech",title: "Won Global Contest #248 (Rank 12)",                  sub: "Top solver in 'Dynamic Programming' category" },
];

// Generate heatmap data
function generateHeatmap() {
  const levels = [0, 1, 2, 3, 4];
  const cells = [];
  for (let i = 0; i < 7; i++) {
    cells.push(levels[Math.floor(Math.random() * levels.length)]);
  }
  for (let i = 0; i < 350; i++) {
    cells.push(levels[Math.floor(Math.random() * levels.length)]);
  }
  return cells;
}

const HEATMAP = generateHeatmap();

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar activePage="Profile" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main" id="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="page-canvas" style={{ marginTop: "var(--topbar-height)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

            {/* ── Hero ── */}
            <section className="profile-hero" aria-label="Profile hero">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  <img src={USER.avatar} alt={USER.name} />
                </div>
                <div className="profile-level-badge">LVL {USER.level}</div>
              </div>

              <div className="profile-info">
                <div className="profile-name-row">
                  <h2 className="profile-name">{USER.name}</h2>
                  <div className="profile-master-badge">
                    <Icon name="verified" filled style={{ fontSize: "12px" }} />
                    Master
                  </div>
                </div>
                <p className="profile-handle">{USER.handle}</p>
                <div className="profile-tags">
                  {USER.tags.map((t) => <span key={t} className="profile-tag">{t}</span>)}
                </div>
                <div className="profile-actions">
                  <button className="profile-edit-btn">Edit Profile</button>
                  <button className="profile-share-btn" aria-label="Share profile">
                    <Icon name="share" />
                  </button>
                </div>
              </div>
            </section>

            {/* ── Stats ── */}
            <section className="profile-stats-grid" aria-label="Profile statistics">
              {STATS.map((s) => (
                <div key={s.label} className={`stat-card${s.gold ? " stat-card--gold" : " stat-card--muted"}`}>
                  {s.icon && <Icon name={s.icon} className="stat-card__bg-icon" aria-hidden="true" />}
                  <p className="stat-card__label">{s.label}</p>
                  <h3 className="stat-card__value" style={s.label === "Coding Streak" ? { color: "var(--primary-container)" } : {}}>{s.value}</h3>
                  {s.bar !== undefined && (
                    <div className="stat-card__bar-track" style={{ marginTop: "1.25rem" }}>
                      <div className="stat-card__bar-fill" style={{ width: `${s.bar}%` }} />
                    </div>
                  )}
                  {s.meta && <p className={`stat-card__meta ${s.metaClass}`}>{s.meta}</p>}
                </div>
              ))}
            </section>

            {/* ── Skill radar + heatmap ── */}
            <div className="profile-viz-grid">
              <div className="skill-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 className="section-label">Skill Proficiency</h4>
                  <Icon name="insights" style={{ color: "var(--primary-container)" }} />
                </div>

                <div className="skill-card__radar">
                  {[0, 8, 16, 24].map((inset) => (
                    <div key={inset} className="radar-ring" style={{ inset: `${inset * 4}px` }} />
                  ))}
                  <div className="radar-shape" />
                  <span className="radar-label radar-label--top radar-label--primary">ALGORITHMS</span>
                  <span className="radar-label radar-label--right">MATH</span>
                  <span className="radar-label radar-label--br">DP</span>
                  <span className="radar-label radar-label--bl">GRAPHS</span>
                  <span className="radar-label radar-label--left">DATA STRUCTURES</span>
                </div>

                <div className="skill-metrics">
                  <div className="skill-metric">
                    <span className="skill-metric__label">Efficiency</span>
                    <span className="skill-metric__val">Top 2%</span>
                  </div>
                  <div className="skill-metric">
                    <span className="skill-metric__label">Code Quality</span>
                    <span className="skill-metric__val">A+</span>
                  </div>
                </div>
              </div>

              <div className="heatmap-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h4 className="section-label">Activity Timeline</h4>
                  <div className="heatmap-legend">
                    <span>Less</span>
                    <div className="heatmap-legend__cells">
                      {[0, 1, 2, 3, 4].map((l) => (
                        <div key={l} className={`heatmap-cell heatmap-cell--${l}`} />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </div>

                <div className="heatmap-grid-wrap">
                  <div className="heatmap-grid">
                    {HEATMAP.map((level, i) => (
                      <div key={i} className={`heatmap-cell heatmap-cell--${level}`} />
                    ))}
                  </div>
                </div>

                <div className="heatmap-footer">
                  {[["Submissions", "3,204"], ["Longest Streak", "122 Days"], ["Current Month", "452"]].map(([label, val]) => (
                    <div key={label}>
                      <p className="heatmap-metric__label">{label}</p>
                      <p className="heatmap-metric__val">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Badges + Milestones ── */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "2rem"
                }}>
                <div>
                <h4 className="section-label" style={{ marginBottom: "1.5rem" }}>Mastery Badges</h4>
                <div className="badges-grid">
                  {BADGES.map((b) => (
                    <div key={b.name} className="badge-card">
                      <div className="badge-card__icon-wrap">
                        <Icon name={b.icon} filled className="badge-card__icon" />
                      </div>
                      <p className="badge-card__name">{b.name}</p>
                      <p className="badge-card__tier">{b.tier}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="section-label" style={{ marginBottom: "1.5rem" }}>Recent Milestones</h4>
                <div className="timeline">
                  {MILESTONES.map((m, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-item__line" />
                      <div className={`timeline-item__dot timeline-item__dot--${m.active ? "active" : "inactive"}`}>
                        <Icon name={m.dotIcon} />
                      </div>
                      <div className="timeline-item__content">
                        <p className={`timeline-item__date timeline-item__date--${m.active ? "active" : "inactive"}`}>{m.date}</p>
                        <p className="timeline-item__title">{m.title}</p>
                        <p className="timeline-item__sub">{m.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}