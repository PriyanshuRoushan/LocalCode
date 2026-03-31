// pages/DashboardPage.jsx
// Page-level component. Composes layout shell + dashboard widgets.
// Import global + page CSS here; child components import their own CSS.

import { useState, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";

import "../styles/global.css";
import "../styles/dashboard.css";

import Sidebar   from "../components/Sidebar.jsx";
import TopBar    from "../components/TopBar.jsx";

import HeroSection            from "../components/dashboard/HeroSection.jsx";
import ProblemDistributionCard from "../components/dashboard/ProblemDistributionCard.jsx";
import WeeklyFrequencyCard    from "../components/dashboard/WeeklyFrequencyCard.jsx";
import RecentActivityCard     from "../components/dashboard/RecentActivityCard.jsx";
import FocusModeCard          from "../components/dashboard/FocusModeCard.jsx";
import ProPerksCard           from "../components/dashboard/ProPerksCard.jsx";

import {
  USER_FALLBACK,
  CURRENT_PROBLEM,
  FOCUS_TOPIC,
  MOCK_PROBLEM_METADATA
} from "../data/dashboardData";

function getProblemMeta(id) {
  // convert id to number or string generically
  const strId = String(id);
  const metadata = MOCK_PROBLEM_METADATA[strId] || MOCK_PROBLEM_METADATA.default;
  return metadata;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState({
    totalSolved: 0,
    totalProbs: 550, // mock total pool
    breakdown: { Easy: 0, Medium: 0, Hard: 0 },
    weeklyData: [
      { day: "Mon", count: 0 },
      { day: "Tue", count: 0 },
      { day: "Wed", count: 0 },
      { day: "Thu", count: 0 },
      { day: "Fri", count: 0 },
      { day: "Sat", count: 0 },
      { day: "Sun", count: 0 },
    ],
    recentActivity: [],
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
        
        let easyVal = 0, mediumVal = 0, hardVal = 0;
        let solvedIds = new Set();
        let acceptedSubmissions = [];
        let allSubmissions = []; // To compute recent activity
        
        // Setup initial week counts
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const todayIdx = new Date().getDay(); 
        const weeklyMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        progress.forEach((sub) => {
          const updatedAt = new Date(sub.updatedAt);
          
          allSubmissions.push(sub);

          // Weekly data tracking (if within past 7 days)
          if (updatedAt >= oneWeekAgo) {
            const dayName = daysOfWeek[updatedAt.getDay()];
            weeklyMap[dayName] += 1;
          }

          if (sub.status === "accepted") {
            if (!solvedIds.has(sub.problemId)) {
              solvedIds.add(sub.problemId);
              const meta = getProblemMeta(sub.problemId);
              if (meta.difficulty === "Easy") easyVal++;
              else if (meta.difficulty === "Medium") mediumVal++;
              else if (meta.difficulty === "Hard") hardVal++;
            }
          }
        });

        // Current week's daily active flag logic
        const weeklyDataArray = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({
          day: d,
          count: weeklyMap[d],
          active: daysOfWeek[todayIdx] === d
        }));

        // Sort for recent activity (latest first)
        allSubmissions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        const recentActivity = allSubmissions.slice(0, 5).map(sub => {
          const meta = getProblemMeta(sub.problemId);
          // format minutes / hours ago
          const diffMs = new Date() - new Date(sub.updatedAt);
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          
          let timeStr = "just now";
          if (diffMins > 0 && diffMins < 60) timeStr = `${diffMins} mins ago`;
          else if (diffHours > 0 && diffHours < 24) timeStr = `${diffHours} hours ago`;
          else if (diffHours >= 24) timeStr = `${Math.floor(diffHours/24)} days ago`;

          return {
            status: sub.status === "accepted" ? "accepted" : "rejected",
            title: meta.title,
            meta: `${sub.language || 'Unknown'} • ${timeStr}`
          };
        });

        setStats({
          totalSolved: solvedIds.size,
          totalProbs: 550,
          breakdown: { Easy: easyVal, Medium: mediumVal, Hard: hardVal },
          weeklyData: weeklyDataArray,
          recentActivity,
          loading: false
        });

      } catch (err) {
        console.error("Error loading progress stats:", err);
        setStats(s => ({ ...s, loading: false }));
      }
    }

    loadStats();
  }, []);

  const userName = user?.name || "Anonymous Developer";
  
  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <Sidebar
        activePage="Dashboard"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main content ── */}
      <main className="app-main" id="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="page-canvas" style={{ marginTop: "var(--topbar-height)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* ── Hero ── */}
            <HeroSection
              userName={userName}
              subtitle={USER_FALLBACK.subtitle}
              ctaLabel={CURRENT_PROBLEM.ctaLabel}
              onCtaClick={() => console.log("Navigate to problem", CURRENT_PROBLEM.id)}
            />

            {/* ── Bento grid ── */}
            <div className="bento-grid">

              {/* Problem distribution — 5/12 cols → full on tablet/mobile */}
              <div className="bento-col-5">
                <ProblemDistributionCard
                  totalSolved={stats.totalSolved}
                  totalProbs={stats.totalProbs}
                  breakdown={stats.breakdown}
                />
              </div>

              {/* Weekly frequency — 7/12 cols */}
              <div className="bento-col-7">
                <WeeklyFrequencyCard data={stats.weeklyData} />
              </div>

              {/* Recent activity — 8/12 cols */}
              <div className="bento-col-8">
                {stats.loading ? (
                  <div style={{ padding: "1.5rem", color: "var(--text-dim)" }}>Loading activity...</div>
                ) : (
                  <RecentActivityCard activities={stats.recentActivity} />
                )}
              </div>

              {/* Right column — 4/12 cols */}
              <div className="bento-col-4" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <FocusModeCard
                  topic={FOCUS_TOPIC}
                  onStart={() => console.log("Start sprint")}
                />
                <ProPerksCard progress={stats.totalSolved > 0 ? Math.min((stats.totalSolved / 50) * 100, 100) : 67} />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}