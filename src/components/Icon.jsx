// components/Icon.jsx
// Thin wrapper around Material Symbols Outlined icon font.
// Usage: <Icon name="dashboard" />  or  <Icon name="check_circle" filled />

export default function Icon({ name, filled = false, className = "", style = {} }) {
  return (
    <span
      className={`material-symbols-outlined${filled ? " icon-filled" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}