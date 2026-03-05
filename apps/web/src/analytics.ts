const COOKIE_CONSENT_KEY = 'cookie-consent';
const UTM_STORAGE_KEY = 'utm-params';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function hasConsent(): boolean {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
}

// --- GA4 Initialization ---

export function initGA4(): void {
  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (!measurementId || !import.meta.env.PROD) return;
  if (!hasConsent()) return;

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
  });
}

// --- UTM Parameter Handling ---

interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function captureUtmParams(): void {
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  let hasUtm = false;

  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const) {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
      hasUtm = true;
    }
  }

  if (hasUtm) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  }
}

export function getUtmParams(): UtmParams | null {
  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// --- Event Tracking ---

type EventName =
  | 'search_performed'
  | 'flight_selected'
  | 'affiliate_link_clicked'
  | 'ad_impression';

export function trackEvent(event: EventName, params?: Record<string, string | number>): void {
  if (!hasConsent()) return;

  const utm = getUtmParams();
  const eventParams = {
    ...params,
    ...(utm || {}),
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, eventParams);
  }
}

// --- Page View ---

export function trackPageView(path: string, title: string): void {
  if (!hasConsent()) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
}
