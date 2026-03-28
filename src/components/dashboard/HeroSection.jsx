// components/dashboard/HeroSection.jsx
import Icon from "../Icon";

/**
 * HeroSection
 * @param {string} userName       - e.g. "Alex"
 * @param {string} subtitle       - motivational subtitle line
 * @param {string} ctaLabel       - label on the continue button
 * @param {function} onCtaClick   - callback when CTA is pressed
 */
export default function HeroSection({
  userName = "Alex",
  subtitle = "You're in the top 5% of solvers this week. One more problem to hit your daily goal.",
  ctaLabel = "Continue Solving: 312. Burst Balloons",
  onCtaClick,
}) {
  return (
    <section className="hero" aria-label="Welcome hero">
      {/* Background image */}
      <div className="hero__bg" aria-hidden="true">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEkDG-gKAQXytrSNFL6eeiUjNuvHQkHRjP1hA5UHA3U1gN61ZS4Uov0gjvb5jy_awLSbpssXaqnlLJ8amvtUVOmo30IPYhGgfGfWONcjXqnLmiswN_HC0vVHyzAZkgUWsV2TuWlK8KVZP7xeeYJ6ZsfX5NxL__pdeMaDfXw_d7z01V41tKx_ey6K-M8r8VixN5tFzwJmQ2utMsm5jVZisq03YLyoMPm7z6AAO9-uGSM3tJdjpeWkTdcxcbexd53ByVvngI2kayDHQ"
          alt=""
        />
        <div className="hero__bg-fade" />
      </div>

      <div className="hero__content">
        <h2 className="hero__title">
          Continue where you left off, <span>{userName}.</span>
        </h2>
        <p className="hero__subtitle">{subtitle}</p>
        <button
          className="gradient-btn hero__cta"
          onClick={onCtaClick}
          aria-label={`Continue solving: ${ctaLabel}`}
        >
          <Icon name="play_circle" filled />
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}