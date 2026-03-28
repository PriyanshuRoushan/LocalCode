// pages/ProblemsPage.jsx
import { useState } from "react";
import "../styles/global.css";
import "../styles/problems.css";

import Sidebar from "../components/Sidebar";
import TopBar  from "../components/TopBar";
import Icon    from "../components/Icon";

const DIFFICULTY_FILTERS = ["All", "Easy", "Medium", "Hard"];
const TAGS = ["Arrays", "Dynamic Programming", "String", "Sorting", "Graph", "Backtracking"];

const PROBLEMS = [
  { id: 1, title: "Two Sum Variations",            tags: ["Array", "Hash Table"],       difficulty: "easy",   acceptance: "49.2%", solved: true  },
  { id: 2, title: "Median of Two Sorted Arrays",   tags: ["Binary Search", "Divide & Conquer"], difficulty: "hard", acceptance: "35.8%", solved: false },
  { id: 3, title: "Subarray Sum Equals K",          tags: ["Prefix Sum"],               difficulty: "medium", acceptance: "43.1%", solved: false },
  { id: 4, title: "Valid Parentheses",              tags: ["Stack", "String"],           difficulty: "easy",   acceptance: "40.5%", solved: true  },
  { id: 5, title: "Trapping Rain Water",            tags: ["Two Pointers", "Monotonic Stack"], difficulty: "hard", acceptance: "59.3%", solved: false },
];

export default function ProblemsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTag, setActiveTag]       = useState(null);

  return (
    <div className="app-shell">
      <Sidebar activePage="Problems" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main" id="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="page-canvas" style={{ marginTop: "var(--topbar-height)" }}>

          {/* ── Daily challenge hero ── */}
          <section className="daily-hero-grid" aria-label="Daily challenge">
            <div className="daily-hero-card">
              <div className="daily-hero-card__bg" aria-hidden="true">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_MExRRec3VUKd6Nsjdx8Q7hYo6K7n1MX1o9RUmNp6N_3eOMlMEjTllY-j8mEkN-VdBuvK2MTgCKbyeIfaoQTFl6vD8uVy1985vvtxZECz4-7Xf3_tduMj_YBckbRykkR3xYIXEXuVFUkcngXHtzc97-LNH-s9kiiaTpEZzniKvvplFRC4Qiym67b6UXCQMurFYCy8mgm_k6ZR7St_Us6D1lw5GPQNhVDowTvze9HigURn0nlvqsznCXzD9Op6FzuAq9-fIveOzbo"
                  alt=""
                />
              </div>

              <div style={{ position: "relative", zIndex: 10 }}>
                <div className="daily-hero-card__pill">
                  <Icon name="event_upcoming" filled style={{ fontSize: "0.875rem" }} />
                  Daily Challenge
                </div>
                <h2 className="daily-hero-card__title">
                  Longest Path in a <br />Weighted Acyclic Graph
                </h2>
                <p className="daily-hero-card__sub">
                  Master Dynamic Programming on trees with this advanced algorithmic puzzle.
                </p>
              </div>

              <div className="daily-hero-card__actions" style={{ position: "relative", zIndex: 10 }}>
                <button className="gradient-btn daily-hero-card__cta">Solve Challenge</button>
                <div className="daily-hero-card__avatars">
                  <div className="avatar-stack">
                    {[
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBf1PGQhBv9pd6_EgdJONZelaxoWW0CNBzQOq34W8uQDclta9MDo5RxrETFmrZjiT6zVqgEoFVCAwNzqW72d6mFJURQAP-3M47NJgeI_QZOiBc17w4alJXpRWOI4srfHAQPLf13PhgZ6OeKk7qISCiCuwmal95bGzTeqavkhUOHpGjMnD_iWDW5a7HgdnCsgzQ-OiU6QOxoqPv_JKdCeDuZggq59NZgW8i313qwegcgktCMVBtjw8g8TzAyTa_tspwCn1g2KNfWh7g",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuATez_ByuzFjvrTG1hoCnbHEM-9VbWZRlvVRFSGJzRhV1nP4vdnf5f4sRgJycgxo13dUnNV2syz3mV0-T6DohVvDBIjFheDpeEE6QM6rhmAMSXxsrgKYfhxPpaL_wKy7HMEOARU5mN2apuITmLsRTSPbEonLiTcDXWxksW6U9ZKHp1u8Kv5Ni6QONtJt_9Nu3_6dpEO5LD1VvnzdYuoZeeZhn99JTF38xbkkFDt9kn3FJ148AViUiuC9KyraSa0WPYAkh944fMizCY",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBPgWduYUB8BfS6u7FwYtc3Y-neQQjT06v6HrhGyhJVIfgB83oF4kcRLnj7T3I_k0CbHdJCx6V8Yc2_pvEVxH8aTiSomUtfirte3SgN-LdVmSmJtHBqx-gh3OyG12VGnpDI6S0qMSDhHN7btjRLZ6dwRkshJibt2s1pr0h3MrE9u-5_9B-7-GW5p1yv0_ttiU3c9PK2jB6_FxSa4MgpQnoONr6RzQnI9CdtvV83zQwrg7oKSBfW85dMlQnyl1coVYV0273Fr9L58wQ",
                    ].map((src, i) => <img key={i} src={src} alt="" />)}
                    <div className="avatar-stack-count">+420</div>
                  </div>
                  <span className="daily-hero-card__solving-label">Solving Right Now</span>
                </div>
              </div>
            </div>

            {/* Progress side cards */}
            <div className="progress-side-cards">
              <div className="progress-card">
                <p className="progress-card__eyebrow">Your Progress</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <span className="progress-card__count">64</span>
                  <span className="progress-card__denom">/ 120</span>
                </div>
                <p className="progress-card__label">Problems solved this month</p>
                <div className="progress-card__track">
                  <div className="progress-card__fill" style={{ width: "53%" }} />
                </div>
              </div>

              <div
                className="upgrade-card"
                role="button"
                tabIndex={0}
                aria-label="Upgrade to Architect Pro"
              >
                <p className="upgrade-card__title">Upgrade to<br />Architect Pro</p>
                <Icon name="workspace_premium" className="upgrade-card__icon" />
              </div>
            </div>
          </section>

          {/* ── Filters ── */}
          <section aria-label="Problem filters">
            <div className="filter-bar">
              <div className="filter-bar__left">
                {DIFFICULTY_FILTERS.map((f) => (
                  <button
                    key={f}
                    className={`filter-btn filter-btn--${activeFilter === f ? "active" : "inactive"}`}
                    onClick={() => setActiveFilter(f)}
                  >{f}</button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div className="filter-bar__divider" aria-hidden="true" />
                <button className="more-filters-btn">
                  <Icon name="filter_list" style={{ fontSize: "1.125rem" }} />
                  More Filters
                </button>
              </div>
            </div>

            <div className="tag-pills">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  className={`tag-pill${activeTag === tag ? " tag-pill--active" : ""}`}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* ── Problem table ── */}
          <section className="problem-table" aria-label="Problem list">
            <div className="problem-table__header" aria-hidden="true">
              <div>Status</div>
              <div>Title</div>
              <div style={{ textAlign: "center" }}>Difficulty</div>
              <div style={{ textAlign: "center" }}>Acceptance</div>
              <div style={{ textAlign: "right" }}>Action</div>
            </div>

            {PROBLEMS.map((p) => (
              <div key={p.id} className="problem-table__row" role="row">
                <div>
                  {p.solved
                    ? <Icon name="check_circle" filled style={{ color: "rgba(34,197,94,0.6)" }} />
                    : <Icon name="radio_button_unchecked" style={{ color: "#404040" }} />}
                </div>
                <div>
                  <p className="problem-table__title">{p.title}</p>
                  <div className="problem-table__tags">
                    {p.tags.map((t) => <span key={t} className="problem-tag">{t}</span>)}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span className={`diff-badge diff-badge--${p.difficulty}`}>{p.difficulty}</span>
                </div>
                <div className="acceptance-rate">{p.acceptance}</div>
                <div>
                  <button className={`solve-btn${p.solved ? " solve-btn--again" : ""}`}>
                    {p.solved ? "Solve Again" : "Solve"}
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* ── Pagination ── */}
          <nav className="pagination" aria-label="Problem list pagination">
            <p className="pagination__info">Showing <span>1 - 25</span> of 2,450 problems</p>
            <div className="pagination__controls">
              <button className="page-btn page-btn--nav" aria-label="Previous page">
                <Icon name="chevron_left" />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {[1, 2, 3].map((n) => (
                  <button key={n} className={`page-btn page-btn--num${n === 1 ? " page-btn--active" : ""}`}>{n}</button>
                ))}
                <span className="pagination__ellipsis">...</span>
                <button className="page-btn page-btn--num">98</button>
              </div>
              <button className="page-btn page-btn--nav" aria-label="Next page">
                <Icon name="chevron_right" />
              </button>
            </div>
          </nav>

        </div>
      </main>

      {/* ── Active sprint panel ── */}
      <aside className="sprint-panel" aria-label="Active sprint">
        <div className="sprint-panel__header">
          <div className="sprint-panel__beam" />
          <div>
            <p className="sprint-panel__eyebrow">Active Sprint</p>
            <p className="sprint-panel__name">Dynamic Programming</p>
          </div>
        </div>
        <p className="sprint-panel__body">Complete 5 more problems to earn the "Recursive Master" badge.</p>
        <div className="sprint-panel__footer">
          <span style={{ color: "var(--primary-container)" }}>60% Complete</span>
          <span style={{ color: "#525252" }}>3/5 Solved</span>
        </div>
      </aside>
    </div>
  );
}