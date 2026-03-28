// components/TopBar.jsx
import "../styles/components/topbar.css";
import Icon from "./Icon";
/**
 * TopBar
 * @param {function} onMenuClick - called when hamburger is tapped (mobile)
 */
export default function TopBar({ onMenuClick }) {
  return (
    <header className="topbar" role="banner">
      {/* Hamburger — mobile only */}
      <button
        className="topbar__hamburger"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Icon name="menu" />
      </button>

      {/* Search */}
      <div className="topbar__search">
        <Icon name="search" className="topbar__search-icon" />
        <input
          type="search"
          className="topbar__search-input"
          placeholder="Search problems, patterns, or tags..."
          aria-label="Search"
        />
      </div>

      {/* Right cluster */}
      <div className="topbar__right">
        {/* Stats pill */}
        <div className="topbar__stats-pill" aria-label="Your stats">
          <div className="topbar__stat">
            <Icon name="local_fire_department" filled style={{ color: "#fb923c", fontSize: "18px" }} />
            <span className="topbar__stat-label">14 Day Streak</span>
          </div>
          <div className="topbar__stat-divider" aria-hidden="true" />
          <div className="topbar__stat">
            <Icon name="stars" filled style={{ color: "var(--primary)", fontSize: "18px" }} />
            <span className="topbar__stat-label">2,450 XP</span>
          </div>
        </div>

        {/* Theme toggle */}
        <button className="topbar__icon-btn" aria-label="Toggle theme">
          <Icon name="contrast" />
        </button>

        {/* Avatar */}
        <img
          className="topbar__avatar"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKk0R9tkCF-7RFv9jKJFMAskFCkpAS5kn-wKEc-yyApp5LeMsbpttpbmJ1lsRvPztxlQZAIqAMqEjilz_KPQhFGpEkx0lzycQf9o0d-EqoBPExwf9nDn_DukiXo0AkeVRnHh7apAfaKAllrv1JTiamGWBr_fKHlir8fV_ip6XMCb23x5C-F1Swwu_akdrEkXUW-umMAJR5q7dmQWZHyTifgXbTzdAMjtsO7fiImMHhDudm27-4iyGHgiB4-UV-3OLV2zDbmHWmQgQ"
          alt="User profile"
        />
      </div>
    </header>
  );
}