// pages/SubmissionsPage.jsx
import { useState } from "react";
import "../styles/global.css";
import "../styles/profile-submissions.css";

import Sidebar from "../components/Sidebar";
import TopBar  from "../components/TopBar";
import Icon    from "../components/Icon";

const FILTER_TABS = ["All", "Accepted", "Wrong Answer", "TLE"];

const SUBMISSIONS = [
  { id: 1, status: "accepted",     problem: "Trapping Rain Water",            lang: "C++",     runtime: "12 ms",  memory: "14.2 MB", date: "Oct 24, 14:22" },
  { id: 2, status: "wrong-answer", problem: "Median of Two Sorted Arrays",    lang: "Python3", runtime: "N/A",    memory: "N/A",     date: "Oct 24, 12:10" },
  { id: 3, status: "tle",          problem: "Sudoku Solver",                  lang: "Java",    runtime: "N/A",    memory: "25.8 MB", date: "Oct 23, 22:45" },
  { id: 4, status: "accepted",     problem: "Longest Palindromic Substring",  lang: "Go",      runtime: "4 ms",   memory: "6.1 MB",  date: "Oct 23, 18:30" },
  { id: 5, status: "accepted",     problem: "Two Sum",                        lang: "Rust",    runtime: "0 ms",   memory: "2.4 MB",  date: "Oct 22, 09:12" },
];

const STATUS_LABELS = {
  "accepted":     "Accepted",
  "wrong-answer": "Wrong Answer",
  "tle":          "TLE",
};

const CODE_PREVIEW = [
  { ln: 1, text: <><span style={{ color: "#f87171" }}>class</span> <span style={{ color: "#fbbf24" }}>Solution</span> {"{"}</> },
  { ln: 2, text: <><span style={{ color: "#f87171" }}>public</span>:</> },
  { ln: 3, text: <><span style={{ color: "#93c5fd" }}>int</span> trap(vector&lt;<span style={{ color: "#93c5fd" }}>int</span>&gt;&amp; height) {"{"}</>, highlight: true },
  { ln: 4, text: <>    if (height.empty()) <span style={{ color: "#f87171" }}>return</span> 0;</> },
  { ln: 5, text: <>    <span style={{ color: "#93c5fd" }}>int</span> left = 0, right = n - 1;</> },
  { ln: 6, text: <>    <span style={{ color: "#93c5fd" }}>int</span> water = 0;</> },
  { ln: 7, text: <>{"  }"}</> },
];

export default function SubmissionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab]     = useState("All");

  const filtered = activeTab === "All"
    ? SUBMISSIONS
    : SUBMISSIONS.filter((s) => {
        if (activeTab === "Accepted")     return s.status === "accepted";
        if (activeTab === "Wrong Answer") return s.status === "wrong-answer";
        if (activeTab === "TLE")          return s.status === "tle";
        return true;
      });

  return (
    <div className="app-shell">
      <Sidebar activePage="Submissions" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main" id="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="page-canvas" style={{ marginTop: "var(--topbar-height)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* ── Header ── */}
            <div className="submissions-header">
              <div>
                <h2 className="submissions-header__title">Submissions History</h2>
                <p className="submissions-header__count">
                  <span className="submissions-header__pulse" />
                  1,248 total code submissions recorded
                </p>
              </div>
              <button className="sync-btn">
                <Icon name="sync" style={{ fontSize: "1rem" }} />
                Sync Now
              </button>
            </div>

            {/* ── Layout ── */}
            <div className="submissions-layout">

              {/* Main table */}
              <div className="submissions-main">
                {/* Filter tabs */}
                <div className="sub-filters">
                  <div className="sub-filter-tabs" role="tablist">
                    {FILTER_TABS.map((tab) => (
                      <button
                        key={tab}
                        role="tab"
                        aria-selected={activeTab === tab}
                        className={`sub-filter-tab${activeTab === tab ? " sub-filter-tab--active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                      >{tab}</button>
                    ))}
                  </div>
                  <button className="lang-filter-btn">
                    Language: All
                    <Icon name="expand_more" style={{ fontSize: "1.125rem" }} />
                  </button>
                </div>

                {/* Table */}
                <div className="sub-table" role="table" aria-label="Submissions">
                  <div className="sub-table__head" role="rowgroup">
                    <div role="columnheader">Status</div>
                    <div role="columnheader">Problem Name</div>
                    <div role="columnheader">Language</div>
                    <div role="columnheader">Runtime</div>
                    <div role="columnheader">Memory</div>
                    <div role="columnheader" style={{ textAlign: "right" }}>Date/Time</div>
                  </div>

                  {filtered.map((s) => (
                    <div key={s.id} className="sub-table__row" role="row">
                      <div>
                        <span className={`status-chip status-chip--${s.status}`}>
                          {STATUS_LABELS[s.status]}
                        </span>
                      </div>
                      <div className="sub-table__problem">{s.problem}</div>
                      <div className="sub-table__lang">{s.lang}</div>
                      <div className="sub-table__metric">{s.runtime}</div>
                      <div className="sub-table__metric">{s.memory}</div>
                      <div className="sub-table__date">{s.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aside: snippet + insight */}
              <aside className="submissions-aside">
                {/* Snippet card */}
                <div className="snippet-card">
                  <div className="snippet-card__header">
                    <h3 className="snippet-card__title">
                      <Icon name="terminal" style={{ color: "var(--primary)", fontSize: "1rem" }} />
                      Snippet Preview
                    </h3>
                    <button className="snippet-card__full-btn">Full Code</button>
                  </div>

                  <div className="snippet-code">
                    <div className="snippet-code__beam" />
                    <div className="snippet-code__lines">
                      <div className="snippet-gutter">
                        {CODE_PREVIEW.map((l) => <div key={l.ln}>{l.ln}</div>)}
                      </div>
                      <div className="snippet-content">
                        {CODE_PREVIEW.map((l) => (
                          <div key={l.ln} className={l.highlight ? "highlighted" : ""}>{l.text}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="snippet-meta">
                    <div className="snippet-meta__row">
                      <span className="snippet-meta__key">Complexity</span>
                      <span className="snippet-meta__val">O(n) Time / O(1) Space</span>
                    </div>
                    <div className="snippet-meta__track">
                      <div className="snippet-meta__fill" style={{ width: "88%" }} />
                    </div>
                    <p className="snippet-meta__note">Beats 88.4% of users with C++ on this problem.</p>
                  </div>
                </div>

                {/* Insight card */}
                <div className="insight-card">
                  <div className="insight-card__icon-wrap">
                    <Icon name="lightbulb" style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h4 className="insight-card__title">Architecture Insight</h4>
                    <p className="insight-card__body">
                      Your most recent 'Accepted' submission for <strong>Trapping Rain Water</strong> utilized the Two-Pointer approach, resulting in optimal space complexity.
                    </p>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}