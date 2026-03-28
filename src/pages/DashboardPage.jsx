// pages/DashboardPage.jsx
// Page-level component. Composes layout shell + dashboard widgets.
// Import global + page CSS here; child components import their own CSS.

import { useState } from "react";

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
  USER,
  CURRENT_PROBLEM,
  PROBLEM_STATS,
  WEEKLY_DATA,
  RECENT_ACTIVITY,
  FOCUS_TOPIC,
} from "../data/dashboardData";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              userName={USER.name}
              subtitle={USER.subtitle}
              ctaLabel={CURRENT_PROBLEM.ctaLabel}
              onCtaClick={() => console.log("Navigate to problem", CURRENT_PROBLEM.id)}
            />

            {/* ── Bento grid ── */}
            <div className="bento-grid">

              {/* Problem distribution — 5/12 cols → full on tablet/mobile */}
              <div className="bento-col-5">
                <ProblemDistributionCard
                  totalSolved={PROBLEM_STATS.totalSolved}
                  totalProbs={PROBLEM_STATS.totalProbs}
                  breakdown={PROBLEM_STATS.breakdown}
                />
              </div>

              {/* Weekly frequency — 7/12 cols */}
              <div className="bento-col-7">
                <WeeklyFrequencyCard data={WEEKLY_DATA} />
              </div>

              {/* Recent activity — 8/12 cols */}
              <div className="bento-col-8">
                <RecentActivityCard activities={RECENT_ACTIVITY} />
              </div>

              {/* Right column — 4/12 cols */}
              <div className="bento-col-4" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <FocusModeCard
                  topic={FOCUS_TOPIC}
                  onStart={() => console.log("Start sprint")}
                />
                <ProPerksCard progress={67} />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}