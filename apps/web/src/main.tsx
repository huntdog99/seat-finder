import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LandingPage from './LandingPage';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import CookieConsent from './CookieConsent';
import { initGA4, captureUtmParams } from './analytics';
import './App.css';

captureUtmParams();
initGA4();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/go" element={<LandingPage source="direct" />} />
        <Route path="/tiktok" element={<LandingPage source="tiktok" />} />
        <Route path="/instagram" element={<LandingPage source="instagram" />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  </React.StrictMode>
);
