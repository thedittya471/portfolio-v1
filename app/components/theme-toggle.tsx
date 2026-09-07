"use client";

import { useState } from "react";

export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  return (
    <button className="theme-toggle" aria-label={light ? "Switch to dark theme" : "Switch to light theme"} aria-pressed={light} onClick={() => {
      document.documentElement.dataset.theme = light ? "dark" : "light";
      setLight(!light);
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        {light ? <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" /></>}
      </svg>
    </button>
  );
}
