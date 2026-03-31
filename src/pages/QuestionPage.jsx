// pages/ProblemPage.jsx
// ──────────────────────────────────────────────────────────────
// Dynamic problem solver page.
//  - Fetches problem data from backend by :id (useParams)
//  - Real textarea code editor with synced line numbers
//  - Language switcher: C++, Python, Java
//    (each maps to server/runners/cppRunner.js etc. via API)
//  - Run Code  → POST /api/run   { problemId, language, code, testInput }
//  - Submit    → POST /api/submit { problemId, language, code }
//  - Collapsible Output Console with verdict display + test input
//  - Per-language code state preserved across tab switches
//  - Collapsible hints, multiple left-panel tabs
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import "../styles/global.css";
import "../styles/questionPage.css";

import Sidebar from "../components/Sidebar";
import TopBar  from "../components/TopBar";
import Icon    from "../components/Icon";

// ── Language config ───────────────────────────────────────────
// 'id' must match what server/runners/<id>Runner.js handles.
const LANGUAGES = [
  {
    id: "cpp",
    label: "C++",
    dot: "#569CD6",
    defaultCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // Write your solution here

};

int main() {
    Solution sol;
    // Test here
    return 0;
}`,
  },
  {
    id: "python",
    label: "Python",
    dot: "#4EC9B0",
    defaultCode: `class Solution:
    def solve(self):
        # Write your solution here
        pass


if __name__ == "__main__":
    sol = Solution()
    print(sol.solve())
`,
  },
  {
    id: "java",
    label: "Java",
    dot: "#CE9178",
    defaultCode: `class Solution {
    public int solve() {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(sol.solve());
    }
}`,
  },
];

async function fetchProblem(id) {
  try {
    const res = await window.electronAPI.getProblem(id);
    return res;
  } catch (err) {
    throw new Error(`Problem not found: ${err.message}`);
  }
}

async function runCode({ problemId, language, code, testInput }) {
  const res = await window.electronAPI.runCode({ problemId, language, code, testInput });
  if (res.stderr && !res.stdout) throw new Error(res.stderr);
  return res;
}

async function submitCode({ problemId, language, code }) {
  const res = await window.electronAPI.submitCode({ problemId, language, code });
  if (res.verdict === "System Error" || res.verdict === "Runtime Error") {
    throw new Error(res.stderr || "Execution failed");
  }
  return res;
}

// ── Left panel tabs ───────────────────────────────────────────
const LEFT_TABS = ["Description", "Editorial", "Submissions"];

// ── Language selector dropdown ────────────────────────────────
function LangDropdown({ lang, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="lang-dropdown" ref={ref}>
      <button
        className="lang-selector"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select programming language"
      >
        <span className="lang-selector__text">{lang.label}</span>
        <Icon
          name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          style={{ fontSize: "0.875rem", color: "#737373" }}
        />
      </button>

      {open && (
        <div className="lang-dropdown__menu" role="listbox" aria-label="Languages">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              role="option"
              aria-selected={l.id === lang.id}
              className={`lang-dropdown__item${l.id === lang.id ? " lang-dropdown__item--active" : ""}`}
              onClick={() => { onChange(l); setOpen(false); }}
            >
              <div className="lang-dropdown__item__dot" style={{ backgroundColor: l.dot }} />
              <span>{l.label}</span>
              {l.id === lang.id && (
                <Icon name="check" style={{ marginLeft: "auto", fontSize: "1rem", color: "var(--primary)" }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Real textarea code editor ─────────────────────────────────
function CodeEditor({ code, onChange }) {
  const taRef  = useRef(null);
  const gutRef = useRef(null);

  const lineCount = code.split("\n").length;

  // Keep gutter scroll in sync with textarea
  const syncScroll = useCallback(() => {
    if (gutRef.current && taRef.current) {
      gutRef.current.scrollTop = taRef.current.scrollTop;
    }
  }, []);

  // Tab → 2 spaces
  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ta    = taRef.current;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const next  = code.substring(0, start) + "  " + code.substring(end);
    onChange(next);
    requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
  };

  return (
    <div className="editor-textarea-wrap">
      {/* Gutter */}
      <div className="editor-lines-col" ref={gutRef} aria-hidden="true">
        {Array.from({ length: lineCount }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={taRef}
        className="editor-textarea"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        aria-label="Code editor — write your solution here"
        aria-multiline="true"
      />
    </div>
  );
}

// ── Output console with test input ───────────────────────────
function ConsolePanel({ open, onClose, consoleState, testInput, onTestInputChange }) {
  const { status, output, verdict, stats } = consoleState;

  const verdictClass =
    verdict === "Accepted"             ? "accepted"
    : verdict === "Time Limit Exceeded" ? "tle"
    : verdict === "Runtime Error"       ? "error"
    : "wrong";

  return (
    <div
      id="console-panel"
      className={`console-panel${open ? " console-panel--open" : " console-panel--collapsed"}`}
      style={{ height: open ? "17rem" : 0 }}
      aria-hidden={!open}
    >
      {/* Header */}
      <div className="console-panel__header">
        <span className="console-panel__title">
          <Icon name="terminal" style={{ fontSize: "1rem" }} />
          Output Console
          {status === "running" && (
            <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", backgroundColor: "#62d5f6", display: "inline-block" }} />
          )}
          {status === "done" && verdict && (
            <span
              style={{
                width: "0.5rem", height: "0.5rem", borderRadius: "9999px", display: "inline-block",
                backgroundColor: verdict === "Accepted" ? "#4ade80" : "#f87171",
              }}
            />
          )}
        </span>
        <button className="console-panel__close" onClick={onClose} aria-label="Close output console">
          <Icon name="close" style={{ fontSize: "1rem" }} />
        </button>
      </div>

      {/* Body — two columns: test input | output */}
      <div style={{ display: "flex", height: "calc(100% - 2.5rem)", overflow: "hidden" }}>

        {/* Left: custom test input */}
        <div className="testcase-area" style={{ width: "38%", borderRight: "1px solid #1a1a1a", overflowY: "auto", flexShrink: 0 }}>
          <p className="testcase-label">Custom Test Input</p>
          <textarea
            className="testcase-input"
            value={testInput}
            onChange={(e) => onTestInputChange(e.target.value)}
            placeholder="stdin…"
            aria-label="Custom test input"
          />
        </div>

        {/* Right: output */}
        <div className="console-panel__body" style={{ flex: 1 }}>
          {status === "idle" && (
            <span className="console-output--idle">Run your code to see output here…</span>
          )}

          {status === "running" && (
            <span className="console-output--running">⟳ Sending to runner…</span>
          )}

          {status === "done" && (
            <>
              {verdict && (
                <div className={`verdict-banner verdict-banner--${verdictClass}`}>
                  <Icon
                    name={verdict === "Accepted" ? "check_circle" : "cancel"}
                    filled
                    style={{ fontSize: "1.125rem" }}
                  />
                  <span>{verdict}</span>
                  {stats && (
                    <span style={{ marginLeft: "auto", fontWeight: 400, fontSize: "0.75rem", opacity: 0.7 }}>
                      {stats.passedCases}/{stats.totalCases} cases · {stats.runtime} · {stats.memory}
                    </span>
                  )}
                </div>
              )}

              {output?.stdout && (
                <div className="console-line">
                  <span className="console-line__prefix">$</span>
                  <span className="console-output--success" style={{ whiteSpace: "pre-wrap" }}>{output.stdout}</span>
                </div>
              )}

              {output?.stderr && (
                <div className="console-line" style={{ marginTop: "0.25rem" }}>
                  <span className="console-line__prefix">!</span>
                  <span className="console-output--error" style={{ whiteSpace: "pre-wrap" }}>{output.stderr}</span>
                </div>
              )}

              {output?.time != null && (
                <div style={{ marginTop: "0.5rem", fontSize: "11px", color: "#525252" }}>
                  Completed in {output.time} ms
                </div>
              )}

              {!output?.stdout && !output?.stderr && !verdict && (
                <span className="console-output--idle">No output produced.</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function ProblemPage() {
  const { id } = useParams(); // linked as /problems/:id

  // layout
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leftTab,     setLeftTab]     = useState("Description");

  // problem data
  const [problem,  setProblem]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  // editor — one code string per language id
  const [lang,    setLang]    = useState(LANGUAGES[0]);
  const [codeMap, setCodeMap] = useState(
    () => Object.fromEntries(LANGUAGES.map((l) => [l.id, l.defaultCode]))
  );
  const [bookmarked, setBookmarked] = useState(false);

  // execution
  const [consoleOpen,  setConsoleOpen]  = useState(false);
  const [consoleState, setConsoleState] = useState({ status: "idle", output: null, verdict: null, stats: null });
  const [running,      setRunning]      = useState(false);
  const [submitting,   setSubmitting]   = useState(false);

  // hints
  const [openHints, setOpenHints] = useState({});

  // test input (seeded from problem's first example)
  const [testInput, setTestInput] = useState("");

  // ── Fetch problem on mount / id change ──────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setFetchErr(null);

    fetchProblem(id)
      .then((data) => {
        setProblem(data);

        // If backend returns per-language starter code, use it
        if (data.starterCode) {
          setCodeMap((prev) => ({ ...prev, ...data.starterCode }));
        }

        // Seed test input from first example
        const firstInput = data.examples?.[0]?.input ?? "";
        setTestInput(firstInput);
      })
      .catch((err) => setFetchErr(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Derived code for current lang ───────────────────────────
  const currentCode = codeMap[lang.id] ?? lang.defaultCode;
  const setCurrentCode = (val) =>
    setCodeMap((prev) => ({ ...prev, [lang.id]: val }));

  // ── Execution helpers ────────────────────────────────────────
  const isExecuting = running || submitting;

  const handleRun = async () => {
    setRunning(true);
    setConsoleOpen(true);
    setConsoleState({ status: "running", output: null, verdict: null, stats: null });
    try {
      const result = await runCode({ problemId: id, language: lang.id, code: currentCode, testInput });
      setConsoleState({
        status: "done",
        output: { stdout: result.stdout ?? "", stderr: result.stderr ?? "", time: result.time },
        verdict: null,
        stats: null,
      });
    } catch (err) {
      setConsoleState({
        status: "done",
        output: { stdout: "", stderr: err.message, time: null },
        verdict: "Runtime Error",
        stats: null,
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setConsoleOpen(true);
    setConsoleState({ status: "running", output: null, verdict: null, stats: null });
    try {
      const result = await submitCode({ problemId: id, language: lang.id, code: currentCode });
      setConsoleState({
        status: "done",
        output: { stdout: result.stdout ?? "", stderr: result.stderr ?? "", time: result.runtime },
        verdict: result.verdict,
        stats: {
          passedCases: result.passedCases,
          totalCases:  result.totalCases,
          runtime:     result.runtime,
          memory:      result.memory,
        },
      });
    } catch (err) {
      setConsoleState({
        status: "done",
        output: { stdout: "", stderr: err.message, time: null },
        verdict: "Runtime Error",
        stats: null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetCode = () => {
    if (window.confirm(`Reset ${lang.label} code to default?`)) {
      setCodeMap((prev) => ({ ...prev, [lang.id]: lang.defaultCode }));
    }
  };

  // ── Hint toggle ──────────────────────────────────────────────
  const toggleHint = (idx) =>
    setOpenHints((prev) => ({ ...prev, [idx]: !prev[idx] }));

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="app-shell">
      <Sidebar activePage="Problems" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main" id="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Full-height workspace below topbar */}
        <div style={{ marginTop: "var(--topbar-height)" }}>
          <div className="problem-workspace">

            {/* ═══════════════════════════════════
                LEFT — Problem statement
            ═══════════════════════════════════ */}
            <section className="problem-statement" aria-label="Problem statement">

              {/* Tab navigation */}
              <div className="problem-tabs" style={{ margin: "-2.5rem -2.5rem 0", padding: "0 2.5rem" }}>
                {LEFT_TABS.map((t) => (
                  <button
                    key={t}
                    className={`problem-tab${leftTab === t ? " problem-tab--active" : ""}`}
                    onClick={() => setLeftTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* ── Description ── */}
              {leftTab === "Description" && (
                <>
                  {loading && (
                    <div style={{ paddingTop: "2rem", color: "#525252", fontStyle: "italic" }}>
                      Loading problem…
                    </div>
                  )}

                  {fetchErr && (
                    <div style={{ paddingTop: "2rem", padding: "1rem", borderRadius: "0.5rem", backgroundColor: "rgba(147,0,10,0.1)", color: "var(--error)" }}>
                      ⚠ {fetchErr}
                    </div>
                  )}

                  {!loading && !fetchErr && problem && (
                    <>
                      {/* Header */}
                      <div style={{ marginTop: "1.5rem" }}>
                        <div className="problem-meta">
                          <span className={`difficulty-badge difficulty-badge--${problem.difficulty?.toLowerCase()}`}>
                            {problem.difficulty}
                          </span>
                          <span className="problem-id">Problem #{problem.id}</span>
                        </div>
                        <h1 className="problem-title" style={{ marginTop: "0.5rem" }}>{problem.title}</h1>
                      </div>

                      {/* Description — HTML strings from DB rendered safely */}
                      {problem.description?.length > 0 && (
                        <div className="problem-body">
                          {problem.description.map((para, i) => (
                            <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                          ))}
                        </div>
                      )}

                      {/* Examples */}
                      {problem.examples?.map((ex, i) => (
                        <div key={i} className="example-block">
                          <p className="example-label">Example {i + 1}</p>
                          <div className="example-row">
                            <span className="example-key">Input:</span>
                            <code className="example-value">{ex.input}</code>
                          </div>
                          <div className="example-row">
                            <span className="example-key">Output:</span>
                            <code className="example-value">{ex.output}</code>
                          </div>
                          {ex.explanation && (
                            <div className="example-row" style={{ marginTop: "0.5rem" }}>
                              <span className="example-key">Explanation:</span>
                              <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.6, flex: 1, whiteSpace: "pre-line" }}>
                                {ex.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Constraints */}
                      {problem.constraints?.length > 0 && (
                        <div>
                          <h3 className="constraints-title">
                            <Icon name="rule" style={{ fontSize: "1rem" }} />
                            Constraints
                          </h3>
                          <ul className="constraints-list" style={{ marginTop: "1rem" }}>
                            {problem.constraints.map((c, i) => (
                              <li key={i}><code className="constraint-code">{c}</code></li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Hints */}
                      {problem.hints?.length > 0 && (
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem", marginBottom: "3rem" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {problem.hints.map((hint, idx) => (
                              <div
                                key={idx}
                                className="hint-block"
                                onClick={() => toggleHint(idx)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === "Enter" && toggleHint(idx)}
                                aria-expanded={!!openHints[idx]}
                              >
                                <div className="hint-block__row">
                                  <div className="hint-block__left">
                                    <Icon name="lightbulb" filled style={{ color: "var(--primary-container)" }} />
                                    <span className="hint-block__title">Hint {idx + 1}</span>
                                  </div>
                                  <Icon
                                    name={openHints[idx] ? "expand_less" : "expand_more"}
                                    style={{ color: "#737373" }}
                                  />
                                </div>
                                {openHints[idx] && (
                                  <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#a3a3a3", lineHeight: 1.6 }}>
                                    {hint}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* ── Editorial tab ── */}
              {leftTab === "Editorial" && (
                <div style={{ paddingTop: "2rem", color: "#525252", fontStyle: "italic" }}>
                  Editorial will be available after you solve this problem.
                </div>
              )}

              {/* ── Submissions tab ── */}
              {leftTab === "Submissions" && (
                <div style={{ paddingTop: "2rem", color: "#525252", fontStyle: "italic" }}>
                  No submissions yet. Submit your solution to see results here.
                </div>
              )}

            </section>

            {/* ═══════════════════════════════════
                RIGHT — Code editor panel
            ═══════════════════════════════════ */}
            <section className="code-editor-panel" aria-label="Code editor">

              {/* ── Editor topbar ── */}
              <div className="editor-topbar">
                <div className="editor-topbar__left">
                  <LangDropdown lang={lang} onChange={setLang} />
                  <div className="editor-divider" aria-hidden="true" />
                  <button
                    className="editor-icon-btn"
                    aria-label={bookmarked ? "Remove bookmark" : "Bookmark this problem"}
                    onClick={() => setBookmarked((b) => !b)}
                    style={{ color: bookmarked ? "var(--primary)" : undefined }}
                  >
                    <Icon name="bookmark" filled={bookmarked} />
                  </button>
                </div>

                <div className="editor-topbar__right">
                  <button
                    className="editor-icon-btn"
                    aria-label="Reset code to default"
                    title="Reset code"
                    onClick={handleResetCode}
                  >
                    <Icon name="restart_alt" />
                  </button>
                  <button className="editor-icon-btn" aria-label="Editor settings">
                    <Icon name="settings" />
                  </button>
                  <button
                    className="editor-icon-btn"
                    aria-label="Enter fullscreen"
                    onClick={() => document.documentElement.requestFullscreen?.()}
                  >
                    <Icon name="fullscreen" />
                  </button>
                </div>
              </div>

              {/* ── Textarea code editor ── */}
              <CodeEditor code={currentCode} onChange={setCurrentCode} />

              {/* ── Status overlay (decorative, bottom-right) ── */}
              <div className="editor-status" aria-hidden="true">
                <div className="editor-status__row">
                  <span className="editor-status__label">Auto-save on</span>
                  <div className="editor-status__dot" style={{ backgroundColor: "#22c55e" }} />
                </div>
                <div className="editor-status__row">
                  <span className="editor-status__label">Intellisense ready</span>
                  <div className="editor-status__dot" style={{ backgroundColor: "#3b82f6" }} />
                </div>
              </div>

              {/* ── Collapsible console + test input ── */}
              <ConsolePanel
                open={consoleOpen}
                onClose={() => setConsoleOpen(false)}
                consoleState={consoleState}
                testInput={testInput}
                onTestInputChange={setTestInput}
              />

              {/* ── Footer: console toggle + run/submit ── */}
              <footer className="editor-footer">
                <div className="editor-footer__left">
                  <button
                    className="console-btn"
                    onClick={() => setConsoleOpen((o) => !o)}
                    aria-expanded={consoleOpen}
                    aria-controls="console-panel"
                  >
                    <Icon name="terminal" style={{ fontSize: "1.125rem" }} />
                    <span>Output Console</span>
                    {/* Status dot */}
                    <div
                      className="console-dot"
                      style={{
                        backgroundColor:
                          consoleState.status === "running"
                            ? "#62d5f6"
                            : consoleState.verdict === "Accepted"
                              ? "#4ade80"
                              : consoleState.verdict
                                ? "#f87171"
                                : "var(--primary-container)",
                      }}
                    />
                  </button>
                </div>

                <div className="editor-footer__right">
                  {/* Run Code */}
                  <button
                    className="run-btn"
                    onClick={handleRun}
                    disabled={isExecuting}
                    aria-busy={running}
                    aria-label="Run code with custom test input"
                  >
                    {running ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="run-spinner" aria-hidden="true" />
                        Running…
                      </span>
                    ) : "Run Code"}
                  </button>

                  {/* Submit */}
                  <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={isExecuting}
                    aria-busy={submitting}
                    aria-label="Submit solution against all test cases"
                  >
                    {submitting ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                          className="run-spinner"
                          aria-hidden="true"
                          style={{ borderTopColor: "var(--on-primary-fixed)" }}
                        />
                        Submitting…
                      </span>
                    ) : "Submit"}
                  </button>
                </div>
              </footer>

            </section>
          </div>
        </div>
      </main>
    </div>
  );
}