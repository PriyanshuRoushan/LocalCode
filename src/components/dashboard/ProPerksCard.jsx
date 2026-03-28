// components/dashboard/ProPerksCard.jsx

/**
 * ProPerksCard
 * @param {string} title       - card heading
 * @param {string} subtitle    - short description
 * @param {number} progress    - 0–100 percentage for the progress bar
 * @param {string} bgImageSrc  - URL of background texture image
 */
export default function ProPerksCard({
  title = "Architect Pro Perks",
  subtitle = "Get access to system design interviews.",
  progress = 67,
  bgImageSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuCVv_FbZjWwIuQrhnIKo7QbZ6xWoCfLxN5ABi9sLDHIHWuMez-gL_rpga07YHqW3eivIUbAK8YEPtP65XcYoFc-hAYReAtZTb7d8zrrLBbjtie7KCO2KXWmaOlDItbzaiAliH3O4Zr-gpjWzcSaJONgctvgRFzSKNv8nuEPn6g_iyFfPIavRXRdVZxpMsqR9m3G7DI2W3MymoQ_PflrbO91eTiIQ_5qWaIqxwKW6w4O3RpulWZvRLH7Mz1gHllc8kUfzjjaLpfLsUA",
}) {
  return (
    <div className="perks-card">
      <img src={bgImageSrc} alt="" className="perks-card__bg" aria-hidden="true" />
      <div className="perks-card__content">
        <h4 className="perks-card__title">{title}</h4>
        <p className="perks-card__sub">{subtitle}</p>
        <div className="perks-card__bar-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="perks-card__bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}