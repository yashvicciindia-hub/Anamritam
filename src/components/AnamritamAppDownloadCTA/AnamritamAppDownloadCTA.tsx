import { useEffect, useRef, useState } from 'react';
import './AnamritamAppDownloadCTA.css';

/**
 * AnamritamAppDownloadCTA
 *
 * A floating, fixed-position Android APK download button that appears on
 * every page of the Anamritam website. It sits above the existing chatbot
 * widget to prevent overlap.
 *
 * Behaviour:
 *  - Desktop: Compact icon-only pill; expands leftward on hover to reveal label.
 *  - Mobile: Collapses back to icon after a brief expanded flash on first touch
 *    (the component manages an `is-expanded` class so touch devices also see
 *    the label).
 *  - Keyboard: Focus expands the button, matching hover appearance.
 *  - Accessibility: Semantic <a> with `download` attribute and aria-label.
 */
export default function AnamritamAppDownloadCTA() {
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  /**
   * On touch devices we toggle expanded state on the first tap so the user
   * can read the label. A second tap (or a tap elsewhere) collapses it.
   * The actual download is triggered on the second tap when already expanded.
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
    if (!expanded) {
      // First touch — expand to reveal label, prevent immediate navigation
      e.preventDefault();
      setExpanded(true);

      // Auto-collapse after 3 s if user doesn't tap again
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
      collapseTimer.current = setTimeout(() => setExpanded(false), 3000);
    }
    // If already expanded, allow the default anchor behaviour (download)
  };

  // Collapse when user clicks/taps elsewhere
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (linkRef.current && !linkRef.current.contains(event.target as Node)) {
        setExpanded(false);
        if (collapseTimer.current) clearTimeout(collapseTimer.current);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, []);

  return (
    <div className="apk-cta" aria-label="Download Anamritam Android App">
      <a
        ref={linkRef}
        href="/Anamritam.apk"
        download="Anamritam.apk"
        className={`apk-cta-link${expanded ? ' is-expanded' : ''}`}
        aria-label="Download Anamritam Android App"
        title="Download Anamritam App for Android"
        id="apk-download-cta"
        onTouchStart={handleTouchStart}
        onBlur={() => {
          // Collapse when focus leaves the button
          setExpanded(false);
          if (collapseTimer.current) clearTimeout(collapseTimer.current);
        }}
      >
        {/* Android icon */}
        <span className="apk-cta-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            {/* Android robot head outline — recognisable and clean */}
            <path d="M6.18 15.64a2.18 2.18 0 0 0 2.18 2.18C8.36 17.82 8.36 20 10.55 20h2.9c2.18 0 2.18-2.18 2.18-2.18h.73a2.18 2.18 0 0 0 2.18-2.18V9H6.18v6.64ZM16.36 4.44l1.05-1.8a.36.36 0 0 0-.13-.5.36.36 0 0 0-.5.13l-1.08 1.87A6.54 6.54 0 0 0 12 3.5c-.99 0-1.93.2-2.7.54L8.22 2.17a.36.36 0 0 0-.5-.13.36.36 0 0 0-.13.5l1.05 1.8C6.73 5.35 5.64 7.13 5.64 9h12.72c0-1.87-1.09-3.65-2-4.56ZM9.82 7.27a.73.73 0 1 1 0-1.46.73.73 0 0 1 0 1.46Zm4.36 0a.73.73 0 1 1 0-1.46.73.73 0 0 1 0 1.46Z" />
          </svg>
        </span>

        {/* Separator */}
        <span className="apk-cta-divider" aria-hidden="true" />

        {/* Text label */}
        <span className="apk-cta-label" aria-hidden="true">
          <span className="apk-cta-label-primary">Download App</span>
          <span className="apk-cta-label-secondary">Android · Free</span>
        </span>
      </a>
    </div>
  );
}
