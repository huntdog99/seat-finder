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
import Seo, { createFlightSearchStructuredData } from './Seo';
import { trackEvent } from './analytics';
import { searchFlights } from './mockFlightService';

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

  const swapAirports = () => {
    setFrom(to);
    setTo(from);
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
      const data = await searchFlights(request);
      setResults(data);
      trackEvent('search_performed', {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        cabin_class: cabinClass,
        results_count: data.totalResults,
      });
    } catch {
      setError({ error: 'Something went wrong. Please try again.' });
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
        <h1>
          <span className="brand-icon" aria-hidden="true">SF</span>
          Seat Finder
        </h1>
        <p>Search flights by the seat you actually want</p>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-row-route">
          <div className="form-group">
            <label htmlFor="from">From</label>
            <input
              id="from"
              className="airport-input"
              type="text"
              placeholder="JFK"
              maxLength={3}
              value={from}
              onChange={e => setFrom(e.target.value.toUpperCase())}
              required
            />
          </div>
          <button type="button" className="swap-btn" onClick={swapAirports} aria-label="Swap origin and destination">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16l-4-4 4-4" />
              <path d="M17 8l4 4-4 4" />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
          </button>
          <div className="form-group">
            <label htmlFor="to">To</label>
            <input
              id="to"
              className="airport-input"
              type="text"
              placeholder="LAX"
              maxLength={3}
              value={to}
              onChange={e => setTo(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
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
            <label htmlFor="class">Cabin Class</label>
            <select id="class" value={cabinClass} onChange={e => setCabinClass(e.target.value as CabinClass)}>
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="stops">Max Stops</label>
            <select id="stops" value={maxStops} onChange={e => setMaxStops(Number(e.target.value))}>
              <option value={0}>Non-stop only</option>
              <option value={1}>1 stop</option>
              <option value={2}>Up to 2 stops</option>
              <option value={3}>Up to 3 stops</option>
            </select>
          </div>
        </div>

        <div className="seat-prefs">
          <div className="seat-prefs-header">
            <span className="prefs-icon" aria-hidden="true">&#9992;</span>
            <h3>Seat Preferences</h3>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seatPos">Position</label>
              <select id="seatPos" value={seatPosition} onChange={e => setSeatPosition(e.target.value as SeatPosition | '')}>
                <option value="">Any position</option>
                <option value="window">Window</option>
                <option value="aisle">Aisle</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="planeHalf">Section</label>
              <select id="planeHalf" value={planeHalf} onChange={e => setPlaneHalf(e.target.value as PlaneHalf)}>
                <option value="any">Any section</option>
                <option value="front">Front of plane</option>
                <option value="back">Back of plane</option>
              </select>
            </div>
          </div>
          <div className="checkbox-group">
            <label className={`checkbox-label${seatFeatures.includes('bulkhead') ? ' checked' : ''}`}>
              <input
                type="checkbox"
                checked={seatFeatures.includes('bulkhead')}
                onChange={() => toggleFeature('bulkhead')}
                aria-label="Bulkhead seat"
              />
              Bulkhead
            </label>
            <label className={`checkbox-label${seatFeatures.includes('emergency_row') ? ' checked' : ''}`}>
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
          <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <div className="error-content">
            <strong>{error.error}</strong>
            {error.details && (
              <ul>
                {error.details.map((d, i) => (
                  <li key={i}>{d.field}: {d.message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <p>Searching for the best seats...</p>
        </div>
      )}

      {results && (
        <>
          <div className="results-section preferred">
            <div className="results-header">
              <span className="results-badge" aria-hidden="true" />
              <h2>{hasSeatPrefs ? 'Preferred Seats Available' : 'Matching Flights'}</h2>
              <span className="results-count">{results.preferred.length} flight{results.preferred.length !== 1 ? 's' : ''}</span>
            </div>
            {results.preferred.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon" aria-hidden="true">&#128186;</span>
                <h3>No exact seat matches</h3>
                <p>Try adjusting your seat preferences or check the other flights below.</p>
              </div>
            ) : (
              results.preferred.map(f => <FlightCard key={f.id} flight={f} />)
            )}
          </div>

          {hasSeatPrefs && results.other.length > 0 && (
            <div className="results-section other">
              <div className="results-header">
                <span className="results-badge" aria-hidden="true" />
                <h2>Other Flights</h2>
                <span className="results-count">{results.other.length} flight{results.other.length !== 1 ? 's' : ''}</span>
              </div>
              {results.other.map(f => <FlightCard key={f.id} flight={f} />)}
            </div>
          )}

          {results.totalResults === 0 && (
            <div className="empty-state">
              <span className="empty-state-icon" aria-hidden="true">&#9992;</span>
              <h3>No flights found</h3>
              <p>Try different dates, airports, or fewer filters to see more results.</p>
            </div>
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
