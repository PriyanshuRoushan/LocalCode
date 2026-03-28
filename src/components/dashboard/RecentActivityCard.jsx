// components/dashboard/RecentActivityCard.jsx
import Icon from "../Icon";

/**
 * RecentActivityCard
 * @param {Array<{ status: "accepted"|"rejected", title: string, meta: string }>} activities
 */
export default function RecentActivityCard({ activities = [] }) {
  return (
    <div className="card">
      <h3 className="section-label" style={{ marginBottom: "1.5rem" }}>Recent Activity</h3>

      <ul className="activity-list" role="list">
        {activities.map((item) => {
          const ok = item.status === "accepted";
          return (
            <li key={item.title} className="activity-item" role="listitem">
              <div className="activity-item__left">
                <div className={`activity-item__icon activity-item__icon--${item.status}`} aria-hidden="true">
                  <Icon name={ok ? "check_circle" : "cancel"} filled />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="activity-item__title">{item.title}</p>
                  <p className="activity-item__meta">{item.meta}</p>
                </div>
              </div>
              <span className={`pill-badge pill-badge--${item.status}`}>
                {ok ? "Accepted" : "Rejected"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}