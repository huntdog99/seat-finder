import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SearchRequest,
  SearchResponse,
  SeatPreferences,
  CabinClass,
  SeatPosition,
  SeatFeature,
  PlaneHalf,
  ApiError,
} from '@seat-finder/shared';
import FlightCard from './FlightCard';
import AdBanner from './AdBanner';
import Seo, { createFlightSearchStructuredData } from './Seo';
import { trackEvent } from './analytics';

const API_BASE = '/api';

export default function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [maxStops, setMaxStops] = useState(2);
  const [seatPosition, setSeatPosition] = useState<SeatPosition | ''>('');
  const [seatFeatures, setSeatFeatures] = useState<SeatFeature[]>([]);
  const [planeHalf, setPlaneHalf] = useState<PlaneHalf>('any');

  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const toggleFeature = (feature: SeatFeature) => {
    setSeatFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (from.toUpperCase() === to.toUpperCase()) {
      setError({ error: 'Destination must be different from origin' });
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const seatPreferences: SeatPreferences = {
      ...(seatPosition ? { position: seatPosition } : {}),
      ...(seatFeatures.length ? { features: seatFeatures } : {}),
      planeHalf,
    };

    const request: SearchRequest = {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      departureDate,
      cabinClass,
      maxStops,
      seatPreferences,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errBody: ApiError = await res.json();
        setError(errBody);
        return;
      }

      const data: SearchResponse = await res.json();
      setResults(data);
      trackEvent('search_performed', {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        cabin_class: cabinClass,
        results_count: data.totalResults,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError({ error: 'Request timed out. Please try again.' });
      } else {
        setError({ error: 'Network error. Please check your connection and try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const hasSeatPrefs = seatPosition || seatFeatures.length > 0 || planeHalf !== 'any';

  const seoStructuredData = results && from && to && departureDate
    ? createFlightSearchStructuredData(from, to, departureDate)
    : undefined;

  return (
    <div className="app">
      <Seo
        title={results ? `Flights from ${from} to ${to}` : undefined}
        description={results ? `Found ${results.totalResults} flights from ${from} to ${to} on ${departureDate}` : undefined}
        canonical="/"
        structuredData={seoStructuredData}
      />
      <header className="app-header">
        <h1>Seat Finder</h1>
        <p>Find flights with your preferred seat</p>
      </header>

      <AdBanner adSlot="header-banner" format="horizontal" className="ad-header-banner" />

      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="from">From</label>
            <input
              id="from"
              type="text"
              placeholder="JFK"
              maxLength={3}
              value={from}
              onChange={e => setFrom(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="to">To</label>
            <input
              id="to"
              type="text"
              placeholder="LAX"
              maxLength={3}
              value={to}
              onChange={e => setTo(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Departure Date</label>
            <input
              id="date"
              type="date"
              value={departureDate}
              onChange={e => setDepartureDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="class">Class</label>
            <select id="class" value={cabinClass} onChange={e => setCabinClass(e.target.value as CabinClass)}>
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="stops">Max Stops</label>
            <select id="stops" value={maxStops} onChange={e => setMaxStops(Number(e.target.value))}>
              <option value={0}>Non-stop</option>
              <option value={1}>1 stop</option>
              <option value={2}>2 stops</option>
              <option value={3}>3 stops</option>
            </select>
          </div>
        </div>

        <div className="seat-prefs">
          <h3>Seat Preferences</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seatPos">Seat Position</label>
              <select id="seatPos" value={seatPosition} onChange={e => setSeatPosition(e.target.value as SeatPosition | '')}>
                <option value="">Any</option>
                <option value="window">Window</option>
                <option value="aisle">Aisle</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="planeHalf">Plane Section</label>
              <select id="planeHalf" value={planeHalf} onChange={e => setPlaneHalf(e.target.value as PlaneHalf)}>
                <option value="any">Any</option>
                <option value="front">Front Half</option>
                <option value="back">Back Half</option>
              </select>
            </div>
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={seatFeatures.includes('bulkhead')}
                onChange={() => toggleFeature('bulkhead')}
                aria-label="Bulkhead seat"
              />
              Bulkhead
            </label>
            <label>
              <input
                type="checkbox"
                checked={seatFeatures.includes('emergency_row')}
                onChange={() => toggleFeature('emergency_row')}
                aria-label="Emergency row seat"
              />
              Emergency Row
            </label>
          </div>
        </div>

        <button className="search-btn" type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {error && (
        <div className="error-msg" role="alert">
          <strong>{error.error}</strong>
          {error.details && (
            <ul>
              {error.details.map((d, i) => (
                <li key={i}>{d.field}: {d.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Searching for flights...</p>
        </div>
      )}

      {results && (
        <>
          <div className="results-section preferred">
            <h2>{hasSeatPrefs ? 'Flights with Your Preferred Seats' : 'Flights Matching Your Criteria'}</h2>
            {results.preferred.length === 0 ? (
              <p className="empty-msg">No flights match your seat preferences.</p>
            ) : (
              results.preferred.map(f => <FlightCard key={f.id} flight={f} />)
            )}
          </div>

          {hasSeatPrefs && results.other.length > 0 && (
            <>
            <AdBanner adSlot="in-feed" format="horizontal" className="ad-in-feed" />
            <div className="results-section other">
              <h2>Other Matching Flights (Seat Preferences Not Guaranteed)</h2>
              {results.other.map(f => <FlightCard key={f.id} flight={f} />)}
            </div>
            </>
          )}

          {results.totalResults === 0 && (
            <p className="empty-msg">No flights found for your search criteria. Try adjusting your filters.</p>
          )}
        </>
      )}

      <footer className="app-footer">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </footer>
    </div>
  );
}
