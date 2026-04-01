import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Icon from "../components/Icon";

import "../styles/global.css";
import "../styles/problemsPage.css";

const DIFFICULTY_RANGES = [
  { label: "Easy",   min: 0,    max: 1200, cls: "diff--easy"   },
  { label: "Medium", min: 1201, max: 1900, cls: "diff--medium" },
  { label: "Hard",   min: 1901, max: 9999, cls: "diff--hard"   },
];

function getDifficulty(rating) {
  if (!rating || rating === 0) return null;
  return DIFFICULTY_RANGES.find(d => rating >= d.min && rating <= d.max) ?? null;
}

const RATING_FILTERS = [
  { label: "All",    min: 0,    max: 9999 },
  { label: "≤ 1200", min: 0,    max: 1200 },
  { label: "1201–1900", min: 1201, max: 1900 },
  { label: "≥ 1901", min: 1901, max: 9999 },
];

export default function ProblemsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [tagFilter, setTagFilter] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        if (!window.electronAPI?.getAllProblems) {
          setError("electronAPI not available — is the app running in Electron?");
          return;
        }
        const data = await window.electronAPI.getAllProblems();
        console.log("[ProblemsPage] loaded", data?.length, "problems");
        setProblems(data ?? []);
      } catch (err) {
        console.error("Failed to load problems:", err);
        setError(err.message ?? String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Collect all unique tags for the filter dropdown
  const allTags = useMemo(() => {
    const set = new Set();
    problems.forEach(p => (p.tags ?? []).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [problems]);

  const { min: rMin, max: rMax } = RATING_FILTERS[ratingFilter];

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return problems.filter(p => {
      const matchSearch = !q ||
        p.title?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        (p.tags ?? []).some(t => t.toLowerCase().includes(q));
      const matchRating = p.rating >= rMin && p.rating <= rMax;
      const matchTag = !tagFilter || (p.tags ?? []).includes(tagFilter);
      return matchSearch && matchRating && matchTag;
    });
  }, [problems, searchQuery, ratingFilter, tagFilter, rMin, rMax]);

  return (
    <div className="app-shell">
      <Sidebar activePage="Problems" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="page-canvas" style={{ marginTop: "var(--topbar-height)" }}>
          <div className="problems-container">

            {/* ── Header ── */}
            <div className="problems-header">
              <div>
                <h1 className="problems-title">Problem Set</h1>
                <p className="problems-subtitle">
                  {loading ? "Loading…" : `${filtered.length} of ${problems.length} problems`}
                </p>
              </div>

              <div className="problems-controls">
                {/* Search */}
                <div className="search-wrap">
                  <Icon name="search" style={{ fontSize: "1rem", color: "#737373", flexShrink: 0 }} />
                  <input
                    type="text"
                    className="problems-search"
                    placeholder="Search title, ID or tag…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Tag filter */}
                <select
                  className="problems-select"
                  value={tagFilter}
                  onChange={e => setTagFilter(e.target.value)}
                >
                  <option value="">All Tags</option>
                  {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                {/* Rating filter pills */}
                <div className="rating-pills">
                  {RATING_FILTERS.map((f, i) => (
                    <button
                      key={f.label}
                      className={`rating-pill${ratingFilter === i ? " rating-pill--active" : ""}`}
                      onClick={() => setRatingFilter(i)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Error ── */}
            {error && (
              <div style={{ padding: "1rem", marginBottom: "1rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "0.5rem", color: "#f87171", fontSize: "0.875rem" }}>
                ⚠ {error}
              </div>
            )}

            {/* ── Table ── */}
            {loading ? (
              <div className="problems-loading">
                <span className="problems-loading__spinner" />
                Loading problems…
              </div>
            ) : filtered.length === 0 ? (
              <div className="problems-empty">
                <Icon name="search_off" style={{ fontSize: "2rem", color: "#404040" }} />
                <p>No problems match your filters.</p>
              </div>
            ) : (
              <div className="problems-table-wrapper">
                <table className="problems-table">
                  <thead>
                    <tr>
                      <th style={{ width: "6rem" }}>ID</th>
                      <th>Title</th>
                      <th style={{ width: "7rem" }}>Rating</th>
                      <th style={{ width: "5rem" }}>Level</th>
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(prob => {
                      const diff = getDifficulty(prob.rating);
                      return (
                        <tr key={prob.id} onClick={() => navigate(`/problem/${prob.id}`)}>

                          <td className="prob-id">{prob.id}</td>

                          <td className="prob-title">{prob.title}</td>

                          <td>
                            {prob.rating ? (
                              <span className={`prob-rating-badge ${diff?.cls ?? ""}`}>
                                {prob.rating}
                              </span>
                            ) : (
                              <span style={{ color: "#525252", fontSize: "0.75rem" }}>—</span>
                            )}
                          </td>

                          <td>
                            {diff ? (
                              <span className={`diff-badge ${diff.cls}`}>{diff.label}</span>
                            ) : (
                              <span style={{ color: "#525252", fontSize: "0.75rem" }}>—</span>
                            )}
                          </td>

                          <td className="prob-tags-cell">
                            {(prob.tags ?? []).slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="prob-tag"
                                onClick={e => { e.stopPropagation(); setTagFilter(tag); }}
                              >
                                {tag}
                              </span>
                            ))}
                            {(prob.tags ?? []).length > 3 && (
                              <span className="prob-tag prob-tag--more">
                                +{prob.tags.length - 3}
                              </span>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
