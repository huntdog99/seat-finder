import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from './Seo';
import { trackPageView } from './analytics';

const FEATURES = [
  {
    icon: 'W',
    title: 'Window Seat',
    desc: 'Views, wall to lean on, no one climbing over you.',
  },
  {
    icon: 'A',
    title: 'Aisle Seat',
    desc: 'Stretch your legs, easy access, deplane faster.',
  },
  {
    icon: '+',
    title: 'Extra Legroom',
    desc: 'Bulkhead and emergency row seats with real space.',
  },
];

const STEPS = [
  { num: '1', title: 'Search', desc: 'Enter your route and dates' },
  { num: '2', title: 'Pick Your Seat Type', desc: 'Window, aisle, legroom, front or back' },
  { num: '3', title: 'Book With Confidence', desc: 'See only flights with your seat available' },
];

const FAQ = [
  {
    q: 'Is Seat Finder free?',
    a: 'Yes. Search is completely free. We make money through affiliate partnerships with airlines.',
  },
  {
    q: 'How do you know which seats are available?',
    a: 'We pull real-time seat maps from airline systems so you see actual availability, not estimates.',
  },
  {
    q: 'Do I book through Seat Finder?',
    a: 'We connect you directly to the airline or booking partner. Your booking is with them, not us.',
  },
];

interface LandingPageProps {
  source?: 'tiktok' | 'instagram' | 'direct';
}

export default function LandingPage({ source = 'direct' }: LandingPageProps) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    trackPageView(`/go${source !== 'direct' ? `/${source}` : ''}`, 'Seat Finder - Find Your Perfect Flight Seat');
  }, [source]);

  const utmSource = searchParams.get('utm_source') || source;

  const handleCta = () => {
    const el = document.getElementById('lp-cta-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/?utm_source=${utmSource}&utm_medium=social&utm_campaign=landing`;
    }
  };

  return (
    <div className="lp">
      <Seo
        title="Seat Finder - Stop Gambling on Airplane Seats"
        description="The only flight search that lets you pick window, aisle, bulkhead, or emergency row before you book."
        canonical="/go"
      />

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <h1 className="lp-headline">Stop Gambling on<br />Airplane Seats</h1>
          <p className="lp-subhead">
            The only flight search that lets you pick window, aisle, bulkhead, or emergency row — <em>before</em> you book.
          </p>
          <button className="lp-cta" onClick={handleCta}>
            Find Your Seat
          </button>
          <p className="lp-proof">Join 12,000+ travelers who found their perfect seat</p>
        </div>
      </section>

      {/* Features */}
      <section className="lp-features">
        <div className="lp-container">
          <h2 className="lp-section-title">Pick Your Seat, Not Just Your Flight</h2>
          <div className="lp-feature-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="lp-how">
        <div className="lp-container">
          <h2 className="lp-section-title">How It Works</h2>
          <div className="lp-steps">
            {STEPS.map(s => (
              <div key={s.num} className="lp-step">
                <div className="lp-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Anchor */}
      <section className="lp-cta-section" id="lp-cta-anchor">
        <div className="lp-container">
          <h2 className="lp-section-title">Ready to Find Your Seat?</h2>
          <p className="lp-cta-sub">No signup required. Search in seconds.</p>
          <a
            className="lp-cta"
            href={`/?utm_source=${utmSource}&utm_medium=social&utm_campaign=landing`}
          >
            Search Flights Now
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-faq">
        <div className="lp-container">
          <h2 className="lp-section-title">Questions?</h2>
          <div className="lp-faq-list">
            {FAQ.map(item => (
              <details key={item.q} className="lp-faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </footer>
    </div>
  );
}
