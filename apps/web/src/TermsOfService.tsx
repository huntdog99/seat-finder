import { Link } from 'react-router-dom';
import Seo from './Seo';

export default function TermsOfService() {
  return (
    <div className="app">
      <Seo title="Terms of Service" description="Seat Finder Terms of Service — usage terms, flight data disclaimer, and liability." canonical="/terms" />
      <header className="app-header">
        <h1><Link to="/" className="header-link">Seat Finder</Link></h1>
      </header>

      <div className="legal-page">
        <h2>Terms of Service</h2>
        <p className="legal-date">Last updated: March 5, 2026</p>

        <section>
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using Seat Finder ("the Service"), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h3>2. Description of Service</h3>
          <p>
            Seat Finder is a flight search tool that helps users find flights with specific
            seat availability and preferences. We aggregate flight data from third-party
            providers to display search results.
          </p>
        </section>

        <section>
          <h3>3. Flight Data Disclaimer</h3>
          <p>
            <strong>Important:</strong> Seat Finder is an informational tool only. We do not
            sell tickets or guarantee seat availability. Flight information including prices,
            schedules, seat maps, and availability is provided by third-party data sources and
            may not be accurate or up-to-date.
          </p>
          <ul>
            <li>Prices shown are estimates and may change without notice</li>
            <li>Seat availability is not guaranteed and may change between search and booking</li>
            <li>Flight schedules and routes are subject to change by airlines</li>
            <li>We are not responsible for discrepancies between displayed information and actual availability</li>
          </ul>
        </section>

        <section>
          <h3>4. User Responsibilities</h3>
          <ul>
            <li>You agree to use the Service only for lawful purposes</li>
            <li>You will not attempt to scrape, crawl, or otherwise extract data from the Service in an automated manner</li>
            <li>You will not attempt to interfere with or disrupt the Service</li>
            <li>You are responsible for verifying all flight information with the airline or booking provider before purchase</li>
          </ul>
        </section>

        <section>
          <h3>5. Intellectual Property</h3>
          <p>
            The Service, including its design, code, and content, is owned by Seat Finder
            and is protected by copyright and other intellectual property laws. You may not
            reproduce, modify, or distribute any part of the Service without our prior written consent.
          </p>
        </section>

        <section>
          <h3>6. Third-Party Links and Services</h3>
          <p>
            The Service may contain links to third-party websites, including airline booking
            pages. We are not responsible for the content, privacy practices, or terms of
            third-party sites. Your interactions with third-party services are governed by
            their respective terms and policies.
          </p>
        </section>

        <section>
          <h3>7. Advertisements</h3>
          <p>
            The Service displays third-party advertisements through Google AdSense and
            potentially other advertising networks. We are not responsible for the content
            of advertisements displayed on the Service.
          </p>
        </section>

        <section>
          <h3>8. Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, Seat Finder shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, including but
            not limited to loss of profits, data, or other intangible losses, resulting from:
          </p>
          <ul>
            <li>Your use or inability to use the Service</li>
            <li>Any errors or inaccuracies in flight data or search results</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Any third-party conduct on the Service</li>
          </ul>
        </section>

        <section>
          <h3>9. Indemnification</h3>
          <p>
            You agree to indemnify and hold harmless Seat Finder from any claims, damages,
            or expenses arising from your use of the Service or violation of these Terms.
          </p>
        </section>

        <section>
          <h3>10. Modifications to Terms</h3>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective
            upon posting to this page. Your continued use of the Service after changes
            constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h3>11. Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of
            the United States, without regard to conflict of law provisions.
          </p>
        </section>

        <section>
          <h3>12. Contact</h3>
          <p>
            For questions about these Terms of Service, please contact us at legal@seatfinder.com.
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
