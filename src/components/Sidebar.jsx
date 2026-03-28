// components/Sidebar.jsx
import "../styles/components/sidebar.css";
import Icon from "./Icon";

const NAV_ITEMS = [
  { icon: "dashboard",     label: "Dashboard",     href: "/" },
  { icon: "code",          label: "Problems",      href: "/problems" },
  { icon: "list_alt",      label: "Sheets",        href: "/sheets" },
  { icon: "edit_document", label: "Custom Sheets", href: "/custom-sheets" },
  { icon: "history",       label: "Submissions",   href: "/submissions" },
  { icon: "person",        label: "Profile",       href: "/profile" },
];

const UTIL_ITEMS = [
  { icon: "settings", label: "Settings", href: "/settings" },
  { icon: "logout",   label: "Logout",   href: "/logout" },
];

/**
 * Sidebar
 * @param {string}   activePage  - label of the currently active nav item
 * @param {boolean}  isOpen      - controls mobile drawer open/close state
 * @param {function} onClose     - called when the overlay is clicked (mobile)
 */
export default function Sidebar({ activePage = "Dashboard", isOpen = false, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${isOpen ? " sidebar-overlay--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`} aria-label="Main navigation">
        {/* ── Logo ── */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <Icon name="architecture" />
          </div>
          <div>
            <p className="sidebar__logo-name">LocalCode</p>
            <p className="sidebar__logo-tagline">Code & Confidence</p>
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="sidebar__nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const isActive = item.label === activePage;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`sidebar__nav-link${isActive ? " sidebar__nav-link--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* ── Bottom ── */}
        <div className="sidebar__bottom">
          <button className="gradient-btn sidebar__new-session">New Session</button>

          {UTIL_ITEMS.map((item) => (
            <a key={item.label} href={item.href} className="sidebar__util-link">
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </aside>
    </>
  );
}