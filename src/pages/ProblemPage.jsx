// pages/ProblemPage.jsx
import { useState } from "react";
import "../styles/global.css";
import "../styles/problem.css";

import Sidebar from "../components/Sidebar";
import TopBar  from "../components/TopBar";
import Icon    from "../components/Icon";

const PROBLEM = {
  id: 312,
  title: "Burst Balloons",
  difficulty: "hard",
  description: [
    <>You are given <code className="inline-code">n</code> balloons, indexed from 0 to <code className="inline-code">n - 1</code>. Each balloon is painted with a number on it represented by an array <code className="inline-code">nums</code>. You are asked to burst all the balloons.</>,
    <>If you burst the <code className="inline-code">i</code>-th balloon, you will get <code className="inline-code">nums[i - 1] * nums[i] * nums[i + 1]</code> coins. After the burst, the <code className="inline-code">i - 1</code>-th and <code className="inline-code">i + 1</code>-th balloons become adjacent.</>,
  ],
  example: {
    input: "nums = [3,1,5,8]",
    output: "167",
    explanation: "nums = [3,1,5,8] → [3,5,8] → [3,8] → [8] → []\ncoins = 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 167",
  },
  constraints: ["n == nums.length", "1 <= n <= 300", "0 <= nums[i] <= 100"],
  hints: ["Hint 1: Dynamic Programming"],
};

const CODE_LINES = [
  { tokens: [{ cls: "tk-keyword", t: "class " }, { cls: "tk-type", t: "Solution" }, { t: " {" }] },
  { tokens: [{ cls: "tk-keyword", t: "public:" }] },
  { tokens: [{ t: "    " }, { cls: "tk-builtin", t: "int " }, { cls: "tk-fn", t: "maxCoins" }, { t: "(" }, { cls: "tk-type", t: "vector" }, { t: "<" }, { cls: "tk-builtin", t: "int" }, { t: ">&amp; " }, { cls: "tk-var", t: "nums" }, { t: ") {" }] },
  { tokens: [{ t: "        " }, { cls: "tk-comment", t: "// Initialize DP table" }] },
  { tokens: [{ t: "        " }, { cls: "tk-builtin", t: "int " }, { cls: "tk-var", t: "n" }, { t: " = nums." }, { cls: "tk-fn", t: "size" }, { t: "();" }] },
  { tokens: [{ t: "        " }, { cls: "tk-type", t: "vector" }, { t: "<" }, { cls: "tk-builtin", t: "int" }, { t: "> " }, { cls: "tk-var", t: "b" }, { t: "(n + " }, { cls: "tk-num", t: "2" }, { t: ", " }, { cls: "tk-num", t: "1" }, { t: ");" }] },
  { tokens: [{ t: "        " }, { cls: "tk-keyword", t: "for " }, { t: "(" }, { cls: "tk-builtin", t: "int " }, { cls: "tk-var", t: "i" }, { t: " = " }, { cls: "tk-num", t: "0" }, { t: "; i < n; i++) b[i + " }, { cls: "tk-num", t: "1" }, { t: "] = nums[i];" }] },
  { highlight: true, tokens: [{ t: "        " }, { cls: "tk-type", t: "vector" }, { t: "<" }, { cls: "tk-type", t: "vector" }, { t: "<" }, { cls: "tk-builtin", t: "int" }, { t: ">> " }, { cls: "tk-var", t: "dp" }, { t: "(n + " }, { cls: "tk-num", t: "2" }, { t: ", " }, { cls: "tk-type", t: "vector" }, { t: "<" }, { cls: "tk-builtin", t: "int" }, { t: ">(n + " }, { cls: "tk-num", t: "2" }, { t: ", " }, { cls: "tk-num", t: "0" }, { t: "));" }] },
  { tokens: [] },
  { tokens: [{ t: "        " }, { cls: "tk-keyword", t: "for " }, { t: "(" }, { cls: "tk-builtin", t: "int " }, { cls: "tk-var", t: "len" }, { t: " = " }, { cls: "tk-num", t: "1" }, { t: "; len <= n; len++) {" }] },
  { tokens: [{ t: "            " }, { cls: "tk-keyword", t: "for " }, { t: "(" }, { cls: "tk-builtin", t: "int " }, { cls: "tk-var", t: "left" }, { t: " = " }, { cls: "tk-num", t: "1" }, { t: "; left <= n - len + " }, { cls: "tk-num", t: "1" }, { t: "; left++) {" }] },
  { tokens: [{ t: "                " }, { cls: "tk-builtin", t: "int " }, { cls: "tk-var", t: "right" }, { t: " = left + len - " }, { cls: "tk-num", t: "1" }, { t: ";" }] },
  { tokens: [{ t: "                " }, { cls: "tk-keyword", t: "for " }, { t: "(" }, { cls: "tk-builtin", t: "int " }, { cls: "tk-var", t: "k" }, { t: " = left; k <= right; k++) {" }] },
  { tokens: [{ t: "                    " }, { cls: "tk-comment", t: "// Logic here..." }] },
  { tokens: [{ t: "                }" }] },
  { tokens: [{ t: "            }" }] },
  { tokens: [{ t: "        }" }] },
  { tokens: [{ t: "    }" }] },
  { tokens: [{ t: "};" }] },
];

function Line({ tokens }) {
  return (
    <div className="editor-line">
      {tokens.map((tk, i) => (
        <span key={i} className={tk.cls || ""}
          dangerouslySetInnerHTML={{ __html: tk.t }} />
      ))}
    </div>
  );
}

export default function ProblemPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hintOpen, setHintOpen]       = useState(false);

  return (
    <div className="app-shell">
      <Sidebar activePage="Problems" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main" id="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div style={{ marginTop: "var(--topbar-height)" }}>
          <div className="problem-workspace">

            {/* ── Left: Problem statement ── */}
            <section className="problem-statement" aria-label="Problem statement">

              {/* Header */}
              <div>
                <div className="problem-meta">
                  <span className={`difficulty-badge difficulty-badge--${PROBLEM.difficulty}`}>
                    {PROBLEM.difficulty}
                  </span>
                  <span className="problem-id">Problem #{PROBLEM.id}</span>
                </div>
                <h1 className="problem-title" style={{ marginTop: "0.5rem" }}>{PROBLEM.title}</h1>
              </div>

              {/* Description */}
              <div className="problem-body">
                {PROBLEM.description.map((p, i) => <p key={i}>{p}</p>)}
              </div>

              {/* Example */}
              <div className="example-block">
                <p className="example-label">Example 1</p>
                <div className="example-row">
                  <span className="example-key">Input:</span>
                  <code className="example-value">{PROBLEM.example.input}</code>
                </div>
                <div className="example-row">
                  <span className="example-key">Output:</span>
                  <code className="example-value">{PROBLEM.example.output}</code>
                </div>
                <div className="example-row" style={{ marginTop: "0.5rem" }}>
                  <span className="example-key">Explanation:</span>
                  <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.6, flex: 1, whiteSpace: "pre-line" }}>
                    {PROBLEM.example.explanation}
                  </p>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="constraints-title">
                  <Icon name="rule" style={{ fontSize: "1rem" }} /> Constraints
                </h3>
                <ul className="constraints-list" style={{ marginTop: "1rem" }}>
                  {PROBLEM.constraints.map((c) => (
                    <li key={c}><code className="constraint-code">{c}</code></li>
                  ))}
                </ul>
              </div>

              {/* Hints */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem", marginBottom: "3rem" }}>
                {PROBLEM.hints.map((hint) => (
                  <div key={hint} className="hint-block" onClick={() => setHintOpen(!hintOpen)}>
                    <div className="hint-block__row">
                      <div className="hint-block__left">
                        <Icon name="lightbulb" filled style={{ color: "var(--primary-container)" }} />
                        <span className="hint-block__title">{hint}</span>
                      </div>
                      <Icon name={hintOpen ? "expand_less" : "expand_more"} style={{ color: "#737373" }} />
                    </div>
                    {hintOpen && (
                      <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#a3a3a3", lineHeight: 1.6 }}>
                        Think about which balloon to burst last in any sub-range [left, right].
                        Use interval DP where dp[i][j] = max coins bursting all balloons in (i, j).
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Right: Code editor ── */}
            <section className="code-editor-panel" aria-label="Code editor">

              {/* Editor topbar */}
              <div className="editor-topbar">
                <div className="editor-topbar__left">
                  <button className="lang-selector" aria-label="Select language">
                    <span className="lang-selector__text">C++</span>
                    <Icon name="keyboard_arrow_down" style={{ fontSize: "0.75rem", color: "#737373" }} />
                  </button>
                  <div className="editor-divider" aria-hidden="true" />
                  <button className="editor-icon-btn" aria-label="Bookmark problem">
                    <Icon name="bookmark" />
                  </button>
                </div>
                <div className="editor-topbar__right">
                  <button className="editor-icon-btn" aria-label="Editor settings"><Icon name="settings" /></button>
                  <button className="editor-icon-btn" aria-label="Fullscreen"><Icon name="fullscreen" /></button>
                </div>
              </div>

              {/* Code body */}
              <div className="editor-body" aria-label="Code editor content">
                {/* Gutter */}
                <div className="editor-gutter" aria-hidden="true">
                  {CODE_LINES.map((_, i) => <span key={i}>{i + 1}</span>)}
                </div>

                {/* Code */}
                <div className="editor-code">
                  <div className="editor-focus-beam" style={{ top: "7.25rem" }} aria-hidden="true" />
                  {CODE_LINES.map((line, i) => (
                    <div key={i} className={`editor-line${line.highlight ? " editor-line--highlighted" : ""}`}>
                      {line.tokens.map((tk, j) => (
                        <span key={j} className={tk.cls || ""}
                          dangerouslySetInnerHTML={{ __html: tk.t || "&nbsp;" }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status overlay */}
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

              {/* Footer */}
              <footer className="editor-footer">
                <div className="editor-footer__left">
                  <button className="console-btn">
                    <Icon name="terminal" style={{ fontSize: "1.125rem" }} />
                    <span>Output Console</span>
                    <div className="console-dot" />
                  </button>
                </div>
                <div className="editor-footer__right">
                  <button className="run-btn">Run Code</button>
                  <button className="submit-btn">Submit</button>
                </div>
              </footer>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}