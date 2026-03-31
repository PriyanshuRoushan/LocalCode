// pages/ProfilePage.jsx
import { useState, useEffect, useMemo } from "react";
import useAuthStore from "../store/useAuthStore";
import "../styles/global.css";
import "../styles/profile-submissions.css";

import Sidebar from "../components/Sidebar";
import TopBar  from "../components/TopBar";
import Icon    from "../components/Icon";

import { MOCK_PROBLEM_METADATA } from "../data/dashboardData";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState({
    totalSolved: 0,
    successRate: 0,
    streak: 0,
    heatmap: Array(357).fill(0),
    totalSubmissions: 0,
    recentMilestones: [],
    loading: true
  });

  useEffect(() => {
    async function loadStats() {
      if (!window.electronAPI?.getProgress) {
        setStats(s => ({ ...s, loading: false }));
        return;
      }
      try {
        const progress = await window.electronAPI.getProgress();
        
        let solvedIds = new Set();
        let totalAc = 0;
        let totalSub = progress.length;
        
        // Heatmap array: 357 days (51 weeks * 7 days)
        // We'll map each submission to a day offset from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dayCounts = new Map(); // offset => count
        const activeDays = new Set();

        progress.forEach((sub) => {
          if (sub.status === "accepted") {
            solvedIds.add(sub.problemId);
            totalAc++;
          }
          
          const subDate = new Date(sub.updatedAt);
          subDate.setHours(0, 0, 0, 0);
          
          const diffTime = Math.abs(today - subDate);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays < 357) {
            dayCounts.set(diffDays, (dayCounts.get(diffDays) || 0) + 1);
            activeDays.add(diffDays);
          }
        });

        // Calculate Success Rate
        const successRate = totalSub === 0 ? 0 : Math.round((totalAc / totalSub) * 1000) / 10;

        // Calculate Streak (consecutive days starting from 0 or 1)
        let currentStreak = 0;
        let checkDay = 0;
        // if today is not active, but yesterday is, streak still applies
        if (!activeDays.has(0) && activeDays.has(1)) {
          checkDay = 1;
        }
        while (activeDays.has(checkDay)) {
          currentStreak++;
          checkDay++;
        }

        // Generate Heatmap (0 to 4 levels)
        // Index 356 is today, 0 is 357 days ago
        const heatmapData = Array(357).fill(0);
        for (let i = 0; i < 357; i++) {
          const daysAgo = 356 - i;
          const count = dayCounts.get(daysAgo) || 0;
          let level = 0;
          if (count > 0) level = 1;
          if (count > 2) level = 2;
          if (count > 4) level = 3;
          if (count > 7) level = 4;
          heatmapData[i] = level;
        }

        // Recent Milestones
        const sortedSubmissions = [...progress].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        const recentMilestones = sortedSubmissions.slice(0, 3).map((sub, idx) => {
          const meta = MOCK_PROBLEM_METADATA[sub.problemId] || MOCK_PROBLEM_METADATA.default;
          const isAc = sub.status === "accepted";
          return {
            active: idx === 0,
            date: new Date(sub.updatedAt).toLocaleDateString(),
            dotIcon: isAc ? "check_circle" : "cancel",
            title: `${isAc ? "Solved" : "Attempted"} ${meta.title}`,
            sub: `Language: ${sub.language || 'Unknown'}`
          };
        });

        setStats({
          totalSolved: solvedIds.size,
          successRate,
          streak: currentStreak,
          heatmap: heatmapData,
          totalSubmissions: totalSub,
          recentMilestones,
          loading: false
        });

      } catch (err) {
        console.error("Error loading profile stats:", err);
        setStats(s => ({ ...s, loading: false }));
      }
    }

    loadStats();
  }, []);

  const userName = user?.name || "Anonymous Developer";
  // Generate a mock handle based on name
  const userHandle = `@${userName.toLowerCase().replace(/\\s+/g, '_')}`;

  const currentLevel = Math.floor(stats.totalSolved / 10) + 1; // 1 level per 10 solved

  const dynamicStats = [
    { label: "Total Solved", value: stats.totalSolved.toString(), meta: "Overall unique problems", metaClass: "stat-card__meta--gold", gold: true, icon: "task_alt" },
    { label: "Global Rank",  value: "#--", meta: "Not calculated yet", metaClass: "stat-card__meta--muted" },
    { label: "Success Rate", value: `${stats.successRate}%`, bar: stats.successRate },
    { label: "Coding Streak", value: `${stats.streak} Days`, meta: stats.streak > 0 ? "Keep it up!" : "Solve a problem to start!", metaClass: "stat-card__meta--muted", gold: true, valueCls: "text-primary-container" },
  ];

  const BADGES = [
    { icon: "workspace_premium", name: "Problem Crusher", tier: stats.totalSolved > 100 ? "Gold Tier" : "Bronze Tier" },
    { icon: "bolt",              name: "Algorithm Ace",   tier: stats.successRate > 80 ? "Diamond Tier" : "Silver Tier" },
    { icon: "calendar_today",    name: "Consistent Coder",tier: stats.streak > 7 ? "Legendary" : "Novice" },
  ];

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
                  <img src="/avatar.jpeg" alt={userName} onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + userName; }} />
                </div>
                <div className="profile-level-badge">LVL {currentLevel}</div>
              </div>

              <div className="profile-info">
                <div className="profile-name-row">
                  <h2 className="profile-name">{userName}</h2>
                  {currentLevel > 10 && (
                    <div className="profile-master-badge">
                      <Icon name="verified" filled style={{ fontSize: "12px" }} />
                      Master
                    </div>
                  )}
                </div>
                <p className="profile-handle">{userHandle}</p>
                <div className="profile-tags">
                  <span className="profile-tag">Algorithms Explorer</span>
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
              {dynamicStats.map((s) => (
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
                    {stats.heatmap.map((level, i) => (
                      <div key={i} className={`heatmap-cell heatmap-cell--${level}`} />
                    ))}
                  </div>
                </div>

                <div className="heatmap-footer">
                  {[
                    ["Submissions", stats.totalSubmissions.toString()], 
                    ["Current Streak", `${stats.streak} Days`], 
                    ["Total Solved", stats.totalSolved.toString()]
                  ].map(([label, val]) => (
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
                  {stats.recentMilestones.length > 0 ? (
                    stats.recentMilestones.map((m, i) => (
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
                    ))
                  ) : (
                    <p style={{ color: "var(--text-dim)" }}>No active milestones yet. Keep solving!</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}