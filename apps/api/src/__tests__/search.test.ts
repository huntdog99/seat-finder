import { describe, it, expect } from 'vitest';
import { validateSearchRequest, partitionFlights, Flight, SeatPreferences } from '@seat-finder/shared';

const makeFlight = (overrides: Partial<Flight> = {}): Flight => ({
  id: 'FL001',
  airline: 'Test Air',
  flightNumber: 'TA 100',
  from: 'JFK',
  to: 'LAX',
  departureTime: '2026-03-10T08:00:00Z',
  arrivalTime: '2026-03-10T11:00:00Z',
  durationMinutes: 300,
  price: 300,
  currency: 'USD',
  stops: 0,
  cabinClass: 'economy',
  availableSeats: [
    { position: 'window', features: [], planeHalf: 'front', seatNumber: '10A' },
    { position: 'aisle', features: ['emergency_row'], planeHalf: 'back', seatNumber: '14D' },
  ],
  ...overrides,
});

describe('validateSearchRequest', () => {
  it('accepts valid request', () => {
    const errors = validateSearchRequest({
      from: 'JFK', to: 'LAX', departureDate: '2026-03-10', cabinClass: 'economy', maxStops: 1,
    });
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid IATA codes', () => {
    const errors = validateSearchRequest({ from: 'jfk', to: '12', departureDate: '2026-03-10', maxStops: 0 });
    expect(errors.some(e => e.field === 'from')).toBe(true);
    expect(errors.some(e => e.field === 'to')).toBe(true);
  });

  it('rejects invalid date', () => {
    const errors = validateSearchRequest({ from: 'JFK', to: 'LAX', departureDate: 'not-a-date', maxStops: 0 });
    expect(errors.some(e => e.field === 'departureDate')).toBe(true);
  });

  it('rejects maxStops out of range', () => {
    const errors = validateSearchRequest({ from: 'JFK', to: 'LAX', departureDate: '2026-03-10', maxStops: 5 });
    expect(errors.some(e => e.field === 'maxStops')).toBe(true);
  });
});

describe('partitionFlights', () => {
  it('returns all as preferred when no seat preferences', () => {
    const flights = [makeFlight()];
    const result = partitionFlights(flights);
    expect(result.preferred).toHaveLength(1);
    expect(result.other).toHaveLength(0);
  });

  it('partitions by seat position', () => {
    const windowFlight = makeFlight({ id: 'F1', availableSeats: [{ position: 'window', features: [], planeHalf: 'front', seatNumber: '1A' }] });
    const aisleFlight = makeFlight({ id: 'F2', availableSeats: [{ position: 'aisle', features: [], planeHalf: 'back', seatNumber: '20C' }] });
    const prefs: SeatPreferences = { position: 'window' };
    const result = partitionFlights([windowFlight, aisleFlight], prefs);
    expect(result.preferred).toHaveLength(1);
    expect(result.preferred[0].id).toBe('F1');
    expect(result.other).toHaveLength(1);
    expect(result.other[0].id).toBe('F2');
  });

  it('partitions by seat features', () => {
    const bulkheadFlight = makeFlight({ id: 'F1', availableSeats: [{ position: 'aisle', features: ['bulkhead'], planeHalf: 'front', seatNumber: '1D' }] });
    const plainFlight = makeFlight({ id: 'F2', availableSeats: [{ position: 'aisle', features: [], planeHalf: 'front', seatNumber: '5D' }] });
    const prefs: SeatPreferences = { features: ['bulkhead'] };
    const result = partitionFlights([bulkheadFlight, plainFlight], prefs);
    expect(result.preferred).toHaveLength(1);
    expect(result.preferred[0].id).toBe('F1');
  });

  it('partitions by plane half', () => {
    const frontFlight = makeFlight({ id: 'F1', availableSeats: [{ position: 'aisle', features: [], planeHalf: 'front', seatNumber: '5C' }] });
    const backFlight = makeFlight({ id: 'F2', availableSeats: [{ position: 'aisle', features: [], planeHalf: 'back', seatNumber: '30C' }] });
    const prefs: SeatPreferences = { planeHalf: 'front' };
    const result = partitionFlights([frontFlight, backFlight], prefs);
    expect(result.preferred).toHaveLength(1);
    expect(result.preferred[0].id).toBe('F1');
    expect(result.other).toHaveLength(1);
  });

  it('sorts by price within each partition', () => {
    const cheapFlight = makeFlight({ id: 'F1', price: 100, availableSeats: [{ position: 'window', features: [], planeHalf: 'front', seatNumber: '1A' }] });
    const expFlight = makeFlight({ id: 'F2', price: 500, availableSeats: [{ position: 'window', features: [], planeHalf: 'front', seatNumber: '2A' }] });
    const prefs: SeatPreferences = { position: 'window' };
    const result = partitionFlights([expFlight, cheapFlight], prefs);
    expect(result.preferred[0].id).toBe('F1');
    expect(result.preferred[1].id).toBe('F2');
  });
});
