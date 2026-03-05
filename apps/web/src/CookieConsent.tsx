import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookie-consent';

type ConsentValue = 'accepted' | 'rejected';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (value: ConsentValue) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-content">
        <p>
          We use cookies to enhance your experience and serve personalized ads.
          By clicking "Accept," you consent to our use of cookies.
          See our <Link to="/privacy">Privacy Policy</Link> for details.
        </p>
        <div className="cookie-actions">
          <button className="cookie-btn cookie-reject" onClick={() => handleConsent('rejected')}>
            Reject
          </button>
          <button className="cookie-btn cookie-accept" onClick={() => handleConsent('accepted')}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
