// pages/SettingsPage.jsx
import { useState } from "react";
import "../styles/global.css";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar activePage="Settings" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-main" id="main-content">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="page-canvas" style={{ marginTop: "var(--topbar-height)" }}>
          <h1>Settings</h1>
          <p>Settings page coming soon...</p>
        </div>
      </main>
    </div>
  );
}
