// components/dashboard/FocusModeCard.jsx
import Icon from "../Icon";

/**
 * FocusModeCard
 * @param {string}   topic       - highlighted skill topic, e.g. "Linked List"
 * @param {string}   description - full description text
 * @param {function} onStart     - callback when "Start Sprint" is clicked
 */
export default function FocusModeCard({
  topic = "Linked List",
  description,
  onStart,
}) {
  const body = description ?? (
    <>
      System has identified that your <b style={{ color: "#e5e5e5" }}>{topic}</b> skills
      could use a refresher. We've curated a quick sprint for you.
    </>
  );

  return (
    <div className="focus-card">
      <div className="focus-card__header">
        <Icon name="psychology" style={{ color: "var(--primary)" }} />
        <h3 className="focus-card__title">Focus Mode</h3>
      </div>
      <p className="focus-card__body">{body}</p>
      <button className="focus-card__btn" onClick={onStart}>
        Start Sprint
      </button>
    </div>
  );
}