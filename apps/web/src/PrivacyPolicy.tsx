import { Link } from 'react-router-dom';
import Seo from './Seo';

export default function PrivacyPolicy() {
  return (
    <div className="app">
      <Seo title="Privacy Policy" description="Seat Finder Privacy Policy — how we collect, use, and protect your data." canonical="/privacy" />
      <header className="app-header">
        <h1><Link to="/" className="header-link">Seat Finder</Link></h1>
      </header>

      <div className="legal-page">
        <h2>Privacy Policy</h2>
        <p className="legal-date">Last updated: March 5, 2026</p>

        <section>
          <h3>1. Introduction</h3>
          <p>
            Seat Finder ("we," "our," or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website and use our flight search service.
          </p>
        </section>

        <section>
          <h3>2. Information We Collect</h3>
          <h4>Information You Provide</h4>
          <ul>
            <li>Flight search queries (origin, destination, dates, seat preferences)</li>
            <li>Contact information if you reach out to us</li>
          </ul>
          <h4>Information Collected Automatically</h4>
          <ul>
            <li>Device and browser information (type, version, operating system)</li>
            <li>IP address and approximate location</li>
            <li>Usage data (pages visited, search queries, time spent)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h3>3. How We Use Your Information</h3>
          <ul>
            <li>To provide and improve our flight search service</li>
            <li>To display relevant advertisements via Google AdSense</li>
            <li>To analyze usage patterns and optimize user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h3>4. Cookies and Tracking Technologies</h3>
          <p>
            We use cookies and similar technologies to enhance your experience. These include:
          </p>
          <ul>
            <li><strong>Essential cookies:</strong> Required for the site to function properly</li>
            <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site</li>
            <li><strong>Advertising cookies:</strong> Used by Google AdSense and partners to serve relevant ads</li>
          </ul>
          <p>
            You can manage your cookie preferences through the cookie consent banner or your browser settings.
            For more information about how Google uses data from partner sites, visit{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              Google's Partner Sites Policy
            </a>.
          </p>
        </section>

        <section>
          <h3>5. Third-Party Services</h3>
          <p>We may share information with:</p>
          <ul>
            <li><strong>Google AdSense:</strong> For displaying advertisements. Google may use cookies to serve ads based on your browsing history.</li>
            <li><strong>Analytics providers:</strong> To help us understand site usage patterns.</li>
            <li><strong>Flight data providers:</strong> To process your search queries. We only share the search parameters necessary to return results.</li>
          </ul>
        </section>

        <section>
          <h3>6. Your Rights (GDPR/CCPA)</h3>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt out of the sale of personal information (CCPA)</li>
            <li>Withdraw consent for data processing (GDPR)</li>
            <li>Data portability</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
          <p>To exercise these rights, please contact us at privacy@seatfinder.com.</p>
        </section>

        <section>
          <h3>7. Data Retention</h3>
          <p>
            We retain search data for up to 90 days for service improvement purposes.
            Aggregated, anonymized data may be retained indefinitely.
          </p>
        </section>

        <section>
          <h3>8. Data Security</h3>
          <p>
            We implement appropriate technical and organizational measures to protect your data.
            However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h3>9. Children's Privacy</h3>
          <p>
            Our service is not directed to children under 13. We do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h3>10. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h3>11. Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy, please contact us at privacy@seatfinder.com.
          </p>
        </section>
      </div>

      <footer className="app-footer">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </footer>
    </div>
  );
}
