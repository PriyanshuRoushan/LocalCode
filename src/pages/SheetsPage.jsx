// pages/SheetsPage.jsx
import { useState } from "react";
import "../styles/global.css";
import "../styles/sheets.css";

import Sidebar from "../components/Sidebar";
import TopBar  from "../components/TopBar";
import Icon    from "../components/Icon";

const PREDEFINED_SHEETS = [
  {
    id: 1,
    icon: "school",
    badge: "Curated",
    title: "Beginner Sheet",
    desc: "Fundamental concepts for coding interviews.",
    solved: 15,
    total: 20,
    pct: 75,
    dots: [
      { color: "rgba(34,197,94,0.5)" }, { color: "rgba(34,197,94,0.5)" },
      { color: "rgba(234,179,8,0.5)" }, { color: "rgba(239,68,68,0.5)" },
    ],
  },
  {
    id: 2,
    icon: "format_list_numbered",
    badge: "Hot",
    title: "Top 75 DSA Sheet",
    desc: "The essential patterns for top tech firms.",
    solved: 30,
    total: 75,
    pct: 40,
    dots: [
      { color: "rgba(34,197,94,0.5)" }, { color: "rgba(234,179,8,0.5)" },
      { color: "rgba(234,179,8,0.5)" }, { color: "#262626" },
    ],
  },
  {
    id: 3,
    icon: "alt_route",
    badge: "Expert",
    title: "Dynamic Programming",
    desc: "Mastering optimal substructure logic.",
    solved: 5,
    total: 50,
    pct: 10,
    dots: Array(4).fill({ color: "rgba(239,68,68,0.5)" }),
  },
];

const CUSTOM_SHEETS = [
  {
    id: 4,
    title: "Company Prep - Google",
    desc: "Targeted problems for upcoming L4 interview.",
    solved: 0,
    total: 12,
    pct: 0,
    isNew: true,
    meta: "Added 2 hours ago",
    icon: "bookmarks",
  },
  {
    id: 5,
    title: "My Favorites",
    desc: "Personal collection of clever solutions.",
    solved: 12,
    total: 24,
    pct: 50,
    icon: "favorite",
    dots: [
      { color: "rgba(34,197,94,0.5)" },
      { color: "rgba(234,179,8,0.5)" },
      { color: "rgba(239,68,68,0.5)" },
    ],
  },
];

function ProgressBar({ pct }) {
  return (
    <div className="sheet-progress__track">
      <div className="sheet-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function SheetCard({ sheet }) {
  return (
    <div className="sheet-card">
      <div className="sheet-card__head">
        <div className="sheet-card__icon">
          <Icon name={sheet.icon} filled={sheet.icon === "favorite"} />
        </div>
        <span className="sheet-card__badge">{sheet.badge}</span>
      </div>
      <h3 className="sheet-card__title">{sheet.title}</h3>
      <p className="sheet-card__desc">{sheet.desc}</p>
      <div>
        <div className="sheet-progress__header">
          <span className="sheet-progress__label">{sheet.solved} / {sheet.total} Solved</span>
          <span className="sheet-progress__pct">{sheet.pct}%</span>
        </div>
        <ProgressBar pct={sheet.pct} />
        {sheet.dots && (
          <div className="sheet-progress__dots">
            {sheet.dots.map((d, i) => (
              <div key={i} className="sheet-progress__dot" style={{ backgroundColor: d.color }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CustomSheetCard({ sheet }) {
  return (
    <div className="sheet-card sheet-card--custom">
      <div className="sheet-card__head">
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ width: "2.5rem", height: "2.5rem", background: "#262626", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#a3a3a3" }}>
            <Icon name={sheet.icon} filled={sheet.icon === "favorite"} style={{ fontSize: "1rem" }} />
          </div>
        </div>
        {sheet.isNew && <span className="sheet-card__new-badge">New</span>}
      </div>
      <h3 className="sheet-card__title">{sheet.title}</h3>
      <p className="sheet-card__desc">{sheet.desc}</p>
      <div>
        <div className="sheet-progress__header">
          <span className="sheet-progress__label">{sheet.solved} / {sheet.total} Solved</span>
          <span className="sheet-progress__pct" style={{ color: sheet.pct === 0 ? "#525252" : "var(--primary)" }}>{sheet.pct}%</span>
        </div>
        <ProgressBar pct={sheet.pct} />
        <div style={{ marginTop: "1rem" }}>
          {sheet.meta
            ? <span className="sheet-card__meta">{sheet.meta}</span>
            : sheet.dots && (
              <div className="sheet-progress__dots">
                {sheet.dots.map((d, i) => (
                  <div key={i} className="sheet-progress__dot" style={{ backgroundColor: d.color }} />
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function SheetsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar activePage="Sheets" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main" id="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="page-canvas" style={{ marginTop: "var(--topbar-height)" }}>

          {/* ── Page header ── */}
          <div className="sheets-header">
            <div className="sheets-header__text">
              <h1 className="sheets-header__title">Mastery Sheets</h1>
              <p className="sheets-header__subtitle">
                Structured learning paths curated for deep focus. Track your progress across foundational algorithms and custom preparation lists.
              </p>
            </div>
            <button className="sheets-header__cta">
              <Icon name="add_circle" filled />
              Create New Sheet
            </button>
          </div>

          {/* ── Predefined sheets ── */}
          <section aria-label="Predefined sheets">
            <div className="section-heading">
              <h2>Predefined Sheets</h2>
              <div className="section-heading__line" />
            </div>
            <div className="sheets-grid">
              {PREDEFINED_SHEETS.map((sheet) => (
                <SheetCard key={sheet.id} sheet={sheet} />
              ))}
            </div>
          </section>

          {/* ── Custom sheets ── */}
          <section aria-label="Custom sheets">
            <div className="section-heading">
              <h2>Custom Sheets</h2>
              <div className="section-heading__line" />
            </div>
            <div className="sheets-grid">
              {CUSTOM_SHEETS.map((sheet) => (
                <CustomSheetCard key={sheet.id} sheet={sheet} />
              ))}
              {/* Create placeholder */}
              <div className="sheet-card--create" role="button" tabIndex={0} aria-label="Create new sheet">
                <div className="sheet-card--create__icon-wrap">
                  <Icon name="add_circle" style={{ color: "#525252" }} />
                </div>
                <span className="sheet-card--create__label">Start a new list</span>
              </div>
            </div>
          </section>

          {/* ── Stats bento ── */}
          <section className="sheets-stats-grid" aria-label="Mastery stats">
            <div className="sheets-momentum-card">
              <Icon name="trending_up" className="sheets-momentum-card__bg-icon" aria-hidden="true" />
              <div className="sheets-momentum-card__content">
                <p className="sheets-momentum-card__eyebrow">Mastery Momentum</p>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <span className="sheets-momentum-card__big-num">62%</span>
                  <span className="sheets-momentum-card__sub">Overall Progress</span>
                </div>
                <div className="sheets-momentum-card__metrics">
                  <div>
                    <span className="sheets-momentum-card__metric-label">Weekly Growth</span>
                    <span className="sheets-momentum-card__metric-val" style={{ color: "#4ade80" }}>+12.4%</span>
                  </div>
                  <div>
                    <span className="sheets-momentum-card__metric-label">Hardest Topic</span>
                    <span className="sheets-momentum-card__metric-val">Heaps &amp; Graphs</span>
                  </div>
                </div>
              </div>
              <div className="sheets-momentum-card__image">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF03cwyQYLPLdX1E-hew_keeBGofL0aZnOrCa5PLQa_FENHWWy4oY8FawvwYWrr6dhVfHfHPerpCM58KhD23N3848GGjfiIGBsENvTapk49YB0pD0pltKWVrj1-zmhODujIulH_R__UNxmjtZRpvV08i2Ub26f7o9OlF_zNIDvlB1qkiiHUtmP3uBnnzVoUBNzq-SK4By_geeXHeYRKhJvBTXt7jzc4yF_QOKag2kKO-gJbIOkh2KqW_WLzMSm0Epo9yJyfCIz3w0"
                  alt="Progress visualization"
                />
              </div>
            </div>

            <div className="sheets-elite-card">
              <Icon name="emoji_events" className="sheets-elite-card__icon" aria-hidden="true" />
              <h4 className="sheets-elite-card__title">Elite Tier Approaching</h4>
              <p className="sheets-elite-card__body">
                Solve 5 more Hard level problems to unlock the "System Architect" badge and exclusive mock interviews.
              </p>
              <a href="#" className="sheets-elite-card__link">View Milestones</a>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}