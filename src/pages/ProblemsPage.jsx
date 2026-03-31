import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Icon from "../components/Icon";

import "../styles/global.css";
import "../styles/problemsPage.css";

export default function ProblemsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProblems() {
      try {
        if (window.electronAPI?.getAllProblems) {
          const data = await window.electronAPI.getAllProblems();
          // parse JSON tags
          const parsedData = data.map(p => {
            let parsedTags = [];
            if (p.tags) {
              try { parsedTags = JSON.parse(p.tags); }
              catch(e) { parsedTags = [p.tags]; }
            }
            return { ...p, tags: parsedTags };
          });
          setProblems(parsedData);
        }
      } catch (err) {
        console.error("Failed to load problems:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-shell">
      <Sidebar activePage="Problems" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="page-canvas" style={{ marginTop: "var(--topbar-height)" }}>
          <div className="problems-container">
            
            <div className="problems-header">
              <h1 className="problems-title">Problem Set</h1>
              <input 
                type="text" 
                className="problems-search" 
                placeholder="Search problems..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div style={{ color: "var(--text-dim)", padding: "2rem 0" }}>Loading problems dataset...</div>
            ) : filteredProblems.length === 0 ? (
              <div style={{ color: "var(--text-dim)", padding: "2rem 0" }}>No problems found. Did you run the seed script?</div>
            ) : (
              <div className="problems-table-wrapper">
                <table className="problems-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Rating</th>
                      <th>Tags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map((prob) => (
                      <tr key={prob.id} onClick={() => navigate(`/problem/${prob.id}`)}>
                        <td className="prob-id">{prob.id}</td>
                        <td className="prob-title">{prob.title}</td>
                        <td className="prob-rating">{prob.rating}</td>
                        <td>
                          {prob.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="prob-tag">{tag}</span>
                          ))}
                          {prob.tags.length > 3 && <span className="prob-tag">+{prob.tags.length - 3}</span>}
                        </td>
                      </tr>
                    ))}
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